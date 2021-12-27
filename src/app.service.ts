import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAdminDto, ResponseCreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';
import { LoginDto, ResponseLoginDto } from './dto/login.dto';
import { ConnenctionDto } from './dto/status-check.dto';
import { UserProfile } from './entities/userProfile';
import { AdminAccess, alreadyExisted, invalidUser, notFoundException, successConstant } from './utils/constants/error.constants';
import { FilterException } from './utils/exceptions/filter-exception';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { UserType } from './entities/baseModel';
import { saltHashGenerator } from './utils/helpers/password-helper';
import { ResponsePrivilegeDto } from './dto/privilege.dto';

@Injectable()
export class AppService {

  constructor(
    @InjectModel(UserProfile)
    private readonly userRepo: typeof UserProfile,
    private jwtService: JwtService
  ){}

  async statusCheck(): Promise<ConnenctionDto> {
    return {
      ...successConstant,
      environment: process.env.ENVIRONMENT,
      statusServer: 'ACTIVE'
    }
  }
  async createUser(createUserDto: CreateUserDto): Promise<ResponseCreateUserDto> {
    try {
      const {username, password} = createUserDto

      // check user existed first
      const checkUser = await this.userRepo.findOne({
        where: {
          username
        }
      })
      if (checkUser) {
        throw new BadRequestException(alreadyExisted)
      }

      const { hash } = await saltHashGenerator(password);

      const newUserData = {
        username,
        hash,
        userType: UserType.CUSTOMER,
      };
      await this.userRepo.create(newUserData)

      return successConstant
    } catch (error) {
      throw new FilterException(error)
    }
  }

  async createAdmin(id: string, createAdminDto: CreateAdminDto): Promise<ResponseCreateAdminDto> {
    try {
      const {username, password} = createAdminDto

      // check if it is Admin
      const checkAdmin = await this.userRepo.findOne({
        where: {
          id
        }
      })
      if (checkAdmin.userType !== UserType.ADMIN) {
        throw new ForbiddenException(AdminAccess)
      }

      // check user existed first
      const checkUser = await this.userRepo.findOne({
        where: {
          username
        }
      })
      if (checkUser) {
        throw new BadRequestException(alreadyExisted)
      }

      const { hash } = await saltHashGenerator(password);

      const newUserData = {
        username,
        hash,
        userType: UserType.ADMIN,
      };
      await this.userRepo.create(newUserData)

      return successConstant
    } catch (error) {
      throw new FilterException(error)
    }
  }

  async login(loginDto: LoginDto): Promise<ResponseLoginDto> {

    try {
      const {username, password} = loginDto
      const user = await this.userRepo.findOne({
        where: {
          username
        }
      })

      if (!user) {
        throw new NotFoundException(notFoundException)
      }

      const comparePassword = await bcrypt.compare(password, user.hash)
      if (!comparePassword) {
        throw new BadRequestException(invalidUser)
      }
      
      const accessToken = await this.jwtService.signAsync({id: user.id}, {
        secret: process.env.SECRET_KEY,
        expiresIn: +process.env.EXP_TOKEN
      });
      await this.userRepo.update({jwtToken: accessToken}, {
        where: {
          id:user.id
        }
      })
      
      return {
        ...successConstant,
        accessToken
      }
    } catch (error) {
      throw new FilterException(error)
    }
  }

  async checkPrivilege(id: string): Promise<ResponsePrivilegeDto> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id
        }
      })
      return {
        ...successConstant,
        userType: user.userType
      }
    } catch (error) {
      throw new FilterException(error)
    }
  }
}
