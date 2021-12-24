import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { successConstant } from './utils/errorConstant';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "statusCheck!"', async () => {
      try {
        expect(await appController.statusCheck()).toEqual({
          ...successConstant,
          environment: process.env.ENVIRONMENT,
          statusServer: 'ACTIVE',
        });
      } catch (error) {
        console.log(error)
      }
    });
  });
});
