import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from 'src/entities/userProfile';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([UserProfile]),
    JwtModule.register({})
  ],
  providers: [
    JwtStrategy
  ]
})
export class AuthModule {}
