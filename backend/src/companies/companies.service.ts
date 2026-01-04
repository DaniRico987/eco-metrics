import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        companyMetrics: {
          include: {
            metric: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async completeOnboarding(id: string, metricIds: string[]) {
    return this.prisma.$transaction(async (prisma) => {
      // Create CompanyMetric records
      if (metricIds && metricIds.length > 0) {
        await prisma.companyMetric.createMany({
          data: metricIds.map((metricId) => ({
            companyId: id,
            metricId,
            isActive: true,
          })),
          skipDuplicates: true,
        });
      }

      // Update company status
      return prisma.company.update({
        where: { id },
        data: { isConfigured: true },
      });
    });
  }

  async toggleMetric(companyId: string, metricId: string) {
    const existing = await this.prisma.companyMetric.findUnique({
      where: {
        companyId_metricId: {
          companyId,
          metricId,
        },
      },
    });

    if (existing) {
      return this.prisma.companyMetric.update({
        where: { id: existing.id },
        data: { isActive: !existing.isActive },
      });
    } else {
      return this.prisma.companyMetric.create({
        data: {
          companyId,
          metricId,
          isActive: true,
        },
      });
    }
  }
}
