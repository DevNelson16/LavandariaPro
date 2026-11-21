import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHome() {
    return {
      message: 'LavandariaPro API',
      status: 'Online',
      version: '1.0.0',
    };
  }
}