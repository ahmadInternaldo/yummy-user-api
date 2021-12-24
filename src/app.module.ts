import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrivilegeModule } from './privilege/privilege.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    PrivilegeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
