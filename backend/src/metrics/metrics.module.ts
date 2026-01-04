import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsResolver } from './metrics.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MetricsResolver, MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
