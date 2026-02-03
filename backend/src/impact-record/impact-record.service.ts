import {
  Injectable,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
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
    console.log('🔍 [BACKEND] === CREATE IMPACT RECORD ===');
    console.log('🔍 [BACKEND] Input month:', input.month, 'year:', input.year);
    console.log('🔍 [BACKEND] Input values count:', input.values.length);
    console.log(
      '🔍 [BACKEND] Input values:',
      JSON.stringify(input.values, null, 2),
    );

    const metricIds = input.values.map((v) => v.metricId);
    const metrics = await this.prisma.metric.findMany({
      where: { id: { in: metricIds }, isActive: true },
    });

    if (metrics.length !== metricIds.length) {
      // Logic to identify which one is missing could be added, or just generic error
      // Ideally check distinct IDs if input has duplicates?
      throw new ConflictException('Some metrics are invalid or inactive.');
    }

    let totalImpact = 0;
    const valuesData = input.values.map((v, index) => {
      const metric = metrics.find((m) => m.id === v.metricId);
      if (!metric) throw new Error('Metric not found unexpectedly'); // Should be covered by length check
      const co2Equivalent = v.amount * metric.emissionFactor;
      totalImpact += co2Equivalent;

      console.log(`🔍 [BACKEND] Processing value [${index}]:`, {
        metricId: v.metricId,
        metricName: metric.name,
        inputAmount: v.amount,
        inputType: typeof v.amount,
        co2Equivalent,
      });

      return {
        metricId: v.metricId,
        amount: v.amount,
        co2Equivalent,
      };
    });

    console.log(
      '🔍 [BACKEND] Final valuesData to save:',
      JSON.stringify(valuesData, null, 2),
    );
    console.log('🔍 [BACKEND] Total impact:', totalImpact);

    try {
      const result = await this.prisma.impactRecord.create({
        data: {
          month: input.month,
          year: input.year,
          totalImpact,
          companyId,
          createdById: userId,
          values: {
            createMany: {
              data: valuesData,
            },
          },
        },
        include: { values: { include: { metric: true } } },
      });

      console.log(
        '🔍 [BACKEND] Created record values:',
        JSON.stringify(
          result.values.map((v) => ({
            metricName: v.metric.name,
            amount: v.amount,
          })),
          null,
          2,
        ),
      );

      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe un registro de impacto para el periodo ${input.month}/${input.year}.`,
        );
      }
      throw error;
    }
  }

  async findAllByCompany(companyId: string) {
    return this.prisma.impactRecord.findMany({
      where: { companyId },
      include: { values: { include: { metric: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findOne(id: string, companyId: string) {
    const record = await this.prisma.impactRecord.findUnique({
      where: { id },
      include: { values: { include: { metric: true } } },
    });

    if (!record || record.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    return record;
  }
}
