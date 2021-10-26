import { INestApplication } from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { AppModule } from '../app.module';

describe('Description', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });
});
