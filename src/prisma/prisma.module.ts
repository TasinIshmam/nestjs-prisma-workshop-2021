import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // prisma module can now be used in any other module without explicit imports
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
