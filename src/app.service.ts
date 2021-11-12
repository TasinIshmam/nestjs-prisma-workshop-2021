import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPing(): string {
    return (
      'Server is running.\nServer Time (Unix Seconds): ' +
      Math.floor(new Date().getTime() / 1000)
    );
  }
}
