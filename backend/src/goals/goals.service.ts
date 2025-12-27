import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalInput } from './dto/create-goal.input';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async findAllByCompany(companyId: string) {
    return this.prisma.goal.findMany({
      where: { companyId },
    });
  }

  async upsert(data: CreateGoalInput, companyId: string) {
    return this.prisma.goal.upsert({
      where: {
        companyId_category_year: {
          companyId,
          category: data.category,
          year: data.year,
        },
      },
      update: {
        target: data.target,
      },
      create: {
        ...data,
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
