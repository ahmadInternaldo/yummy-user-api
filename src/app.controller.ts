import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateAdminDto, ResponseCreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';
import { LoginDto, ResponseLoginDto } from './dto/login.dto';
import { ConnenctionDto } from './dto/status-check.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async statusCheck(): Promise<ConnenctionDto> {
    return this.appService.statusCheck();
  }

  @Post('create-user')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseCreateUserDto> {
    return this.appService.createUser(createUserDto);
  }

  @Post('create-admin')
  async createAdmin(
    @Req() req,
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<ResponseCreateAdminDto> {
    //nanti akan dihapus
    req['user'] = {id: 'testing'}
    return this.appService.createAdmin(req.user.id, createAdminDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<ResponseLoginDto> {
    return this.appService.login(loginDto);
  }
}
