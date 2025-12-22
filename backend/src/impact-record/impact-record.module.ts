import { Module } from '@nestjs/common';
import { ImpactRecordService } from './impact-record.service';
import { ImpactRecordResolver } from './impact-record.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ImpactRecordService, ImpactRecordResolver],
  exports: [ImpactRecordService],
})
export class ImpactRecordModule {}
