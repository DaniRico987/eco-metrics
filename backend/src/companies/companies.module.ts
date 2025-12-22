import { Module } from '@nestjs/common';
import { CompaniesResolver } from './companies.resolver';
import { CompaniesService } from './companies.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CompaniesResolver, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
