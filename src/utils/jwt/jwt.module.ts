import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtHelperService } from './jwt.service';

@Module({
  imports: [
    JwtModule.register({})
  ],
  providers: [JwtHelperService]
})
export class JwtHelperModule {}
