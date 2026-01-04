import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalInput } from './dto/create-goal.input';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async findAllByCompany(companyId: string) {
    return this.prisma.goal.findMany({
      where: { companyId },
      include: { metric: true }, // Include metric details
    });
  }

  async upsert(data: CreateGoalInput, companyId: string) {
    return this.prisma.goal.upsert({
      where: {
        companyId_metricId_year: {
          companyId,
          metricId: data.metricId,
          year: data.year,
        },
      },
      update: {
        target: data.target,
      },
      create: {
        metricId: data.metricId,
        target: data.target,
        year: data.year,
        companyId,
      },
    });
  }

  async remove(id: string, companyId: string) {
    return this.prisma.goal.delete({
      where: { id, companyId },
    });
  }
}
