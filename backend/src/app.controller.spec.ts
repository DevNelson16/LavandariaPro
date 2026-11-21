import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the API information', () => {
      expect(appController.getHome()).toEqual({
        message: 'LavandariaPro API',
        status: 'Online',
        version: '1.0.0',
      });
    });
  });
});