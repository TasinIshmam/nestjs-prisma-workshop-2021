import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPing(): string {
    return 'Server is running. Time: ' + new Date().toString();
  }
}
