import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateAdminDto, ResponseCreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';
import { LoginDto, ResponseLoginDto } from './dto/login.dto';
import { ResponsePrivilegeDto } from './dto/privilege.dto';
import { ConnenctionDto } from './dto/status-check.dto';
import { JwtAuthGuard } from './utils/auth/jwt-auth.guard';
import { OneUserLoginGuard } from './utils/auth/one-user-login-auth.guard';
import { Public } from './utils/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  async statusCheck(): Promise<ConnenctionDto> {
    return this.appService.statusCheck();
  }

  @Public()
  @Post('create-user')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseCreateUserDto> {
    return this.appService.createUser(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<ResponseLoginDto> {
    return this.appService.login(loginDto);
  }

  // userAdmin must create by other admin
  @UseGuards(OneUserLoginGuard)
  @Post('create-admin')
  async createAdmin(
    @Req() req,
    @Body() createAdminDto: CreateAdminDto,
    ): Promise<ResponseCreateAdminDto> {
      return this.appService.createAdmin(req.user.id, createAdminDto);
    }
    
    
  @UseGuards(OneUserLoginGuard)
  @Get('privilege')
  async checkPrivilege(@Req() req): Promise<ResponsePrivilegeDto> {
    return this.appService.checkPrivilege(req.user.id)
  }
}
