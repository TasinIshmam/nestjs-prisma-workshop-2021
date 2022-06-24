import { Prisma } from '@prisma/client';

export type ProductWithCreatedBy = Prisma.ProductGetPayload<{
  include: {
    createdBy: true;
  };
}>;
