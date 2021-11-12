import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('info')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  @ApiOkResponse({ type: String })
  getPing(): string {
    return this.appService.getPing();
  }
}
