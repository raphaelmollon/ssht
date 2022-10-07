import { Controller, Get, Req, Res, Body, Headers } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';

@Controller()
@Roles('editor','reader','guest')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('test')
  getTest(@Headers() h): string {
    return this.appService.getTest(h);
  }
}
