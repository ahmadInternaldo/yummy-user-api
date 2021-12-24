import { Injectable } from '@nestjs/common';
import { CreateAdminDto, ResponseCreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';
import { LoginDto, ResponseLoginDto } from './dto/login.dto';
import { ConnenctionDto } from './dto/status-check.dto';
import { successConstant } from './utils/errorConstant';

@Injectable()
export class AppService {
  async statusCheck(): Promise<ConnenctionDto> {
    return {
      ...successConstant,
      environment: process.env.ENVIRONMENT,
      statusServer: 'ACTIVE'
    }
  }
  async createUser(createUserDto: CreateUserDto): Promise<ResponseCreateUserDto> {
    return successConstant
  }

  async createAdmin(id: string, createAdminDto: CreateAdminDto): Promise<ResponseCreateAdminDto> {
    return successConstant
  }

  async login(loginDto: LoginDto): Promise<ResponseLoginDto> {
    return {
      ...successConstant,
      accessToken: ''
    }
  }
}
