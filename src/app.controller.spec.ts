import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserType } from './entities/baseModel';
import { UserProfile } from './entities/userProfile';
import { JwtStrategy } from './utils/auth/jwt-strategy';
import {
  AdminAccess,
  alreadyExisted,
  invalidUser,
  notFoundException,
  successConstant,
} from './utils/constants/error.constants';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.HOST,
          port: +process.env.PORT,
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
          database: process.env.DATABASE,
          models: [UserProfile],
          synchronize: false,
          sync: {
            alter: false,
          },
          autoLoadModels: false,
        }),
        SequelizeModule.forFeature([UserProfile]),
        JwtModule.register({}),
      ],
      providers: [AppService, JwtStrategy],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('TEST SERVER', () => {
    it('should return [SUCCESS] "statusCheck!"', async () => {
      try {
        expect(await appController.statusCheck()).toEqual({
          ...successConstant,
          environment: process.env.ENVIRONMENT,
          statusServer: 'ACTIVE',
        });
      } catch (error) {}
    });
  });

  describe('TEST LOGIN', () => {
    const successLoginAdmin = {
      username: 'admin1',
      password: 'testing',
    };
    it('should return [SUCCESS] accessToken', async () => {
      try {
        const data = await appController.login(successLoginAdmin);
        expect(data).toEqual({
          ...successConstant,
          accessToken: data.accessToken,
        });
      } catch (error) {}
    });
    const successLoginCustomer = {
      username: 'customer1',
      password: 'testing',
    };
    it('should return [SUCCESS] accessToken', async () => {
      try {
        const data = await appController.login(successLoginCustomer);
        expect(data).toEqual({
          ...successConstant,
          accessToken: data.accessToken,
        });
      } catch (error) {}
    });
    it('should return [ERROR] invalidUser', async () => {
      try {
        const usernameOrPasswordWrong = {
          username: 'customer1',
          password: 'testin',
        };
        await appController.login(usernameOrPasswordWrong);
      } catch (error) {
        expect(error.response).toEqual(invalidUser);
      }
    });
    it('should return [ERROR] notFoundException', async () => {
      try {
        const notFoundUsername = {
          username: 'testing',
          password: 'testin',
        };
        await appController.login(notFoundUsername);
      } catch (error) {
        expect(error.response).toEqual(notFoundException);
      }
    });
  });
  describe('CREATE USER AND ADMIN', () => {
    it('should return [SUCCESS] create customer', async () => {
      try {
        const customer = {
          username: 'customer2',
          password: 'testing',
        };
        const data = await appController.createUser(customer);
        expect(data).toEqual(successConstant);
      } catch (error) {}
    });
    it('should return [SUCCESS] create Admin', async () => {
      try {
        const req = {
          user: {
            id: '6701959c-42ef-413c-aa00-730b5a349b2d',
          },
        };
        const Admin = {
          username: 'admin2',
          password: 'testing',
        };
        const data = await appController.createAdmin(req, Admin);
        expect(data).toEqual(successConstant);
      } catch (error) {}
    });

    it('should return [ERROR] create customer Already existed', async () => {
      try {
        const customer = {
          username: 'customer2',
          password: 'testing',
        };
        await appController.createUser(customer);
      } catch (error) {
        await UserProfile.destroy({
          where: {
            username: 'customer2',
          },
        });
        expect(error.response).toEqual(alreadyExisted);
      }
    });
    it('should return [ERROR] create AdminAccess', async () => {
      try {
        const req = {
          user: {
            id: 'da48609d-5650-4c80-9f63-693c3ae34172',
          },
        };
        const Admin = {
          username: 'admin1',
          password: 'testing',
        };
        await appController.createAdmin(req, Admin);
      } catch (error) {
        expect(error.response).toEqual(AdminAccess);
      }
    });
    it('should return [ERROR] create Admin Username already existed', async () => {
      try {
        const req = {
          user: {
            id: '6701959c-42ef-413c-aa00-730b5a349b2d',
          },
        };
        const Admin = {
          username: 'admin2',
          password: 'testing',
        };
        await appController.createAdmin(req, Admin);
      } catch (error) {
        await UserProfile.destroy({
          where: {
            username: 'admin2',
          },
        });
        expect(error.response).toEqual(alreadyExisted);
      }
    });
  });
  describe('PRIVILEGE', () => {
    it('should return [SUCCESS] getPrivilegeAdmin', async () => {
      try {
        const id = '6701959c-42ef-413c-aa00-730b5a349b2d';
        const dataAdmin = await appController.checkPrivilege(id);
        expect(dataAdmin).toEqual({
          ...successConstant,
          userType: UserType.ADMIN,
        });
      } catch (error) {}
    });
    it('should return [SUCCESS] getPrivilegeCustomer', async () => {
      try {
        const id = 'da48609d-5650-4c80-9f63-693c3ae34172';
        const dataCustomer = await appController.checkPrivilege(id);
        expect(dataCustomer).toEqual({
          ...successConstant,
          userType: UserType.CUSTOMER,
        });
      } catch (error) {}
    });
  });
});
