import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsResolver } from './goals.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [GoalsService, GoalsResolver],
  imports: [PrismaModule],
})
export class GoalsModule {}
