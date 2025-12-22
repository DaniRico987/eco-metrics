import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImpactRecordInput } from './dto/create-impact-record.input';

@Injectable()
export class ImpactRecordService {
  constructor(private prisma: PrismaService) {}

  async create(
    input: CreateImpactRecordInput,
    userId: string,
    companyId: string,
  ) {
    const totalImpact =
      input.energyKwh + input.waterM3 + input.wasteKg + input.transportKm;

    return this.prisma.impactRecord.create({
      data: {
        ...input,
        totalImpact,
        companyId,
        createdById: userId,
      },
    });
  }

  async findAllByCompany(companyId: string) {
    return this.prisma.impactRecord.findMany({
      where: { companyId },
      orderBy: { year: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const record = await this.prisma.impactRecord.findUnique({
      where: { id },
    });

    if (!record || record.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    return record;
  }
}
