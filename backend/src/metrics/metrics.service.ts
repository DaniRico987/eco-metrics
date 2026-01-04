import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMetricInput } from './dto/create-metric.input';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultMetrics();
  }

  async seedDefaultMetrics() {
    this.logger.log('Checking default metrics...');
    const defaults = [
      {
        name: 'Energía',
        unit: 'kWh',
        description: 'Consumo eléctrico total de las instalaciones.',
        icon: 'Zap',
        color: '#FFC107',
        emissionFactor: 0.5,
      },
      {
        name: 'Agua',
        unit: 'm3',
        description: 'Consumo de agua potable y recursos hídricos.',
        icon: 'Droplet',
        color: '#2196F3',
        emissionFactor: 0.3,
      },
      {
        name: 'Residuos',
        unit: 'kg',
        description: 'Generación de desechos sólidos y reciclables.',
        icon: 'Trash2',
        color: '#757575',
        emissionFactor: 0.1,
      },
      {
        name: 'Transporte',
        unit: 'km',
        description: 'Distancia recorrida por flota logística o empleados.',
        icon: 'Truck',
        color: '#FF5722',
        emissionFactor: 0.2,
      },
    ];

    // Map English names to Spanish for migration if they exist
    const translationMap = {
      Energy: 'Energía',
      Water: 'Agua',
      Waste: 'Residuos',
      Transport: 'Transporte',
    };

    for (const m of defaults) {
      // Check if English version exists to update it
      const englishName = Object.keys(translationMap).find(
        (key) => translationMap[key] === m.name,
      );
      const existing = await this.prisma.metric.findFirst({
        where: {
          OR: [{ name: m.name }, { name: englishName }],
        },
      });

      if (!existing) {
        await this.prisma.metric.create({ data: m });
        this.logger.log(`Seeded default metric: ${m.name}`);
      } else if (existing.name !== m.name || !existing.description) {
        // Update existing (even if it was English)
        await this.prisma.metric.update({
          where: { id: existing.id },
          data: {
            name: m.name,
            description: m.description,
            unit: m.unit,
            icon: m.icon,
            color: m.color,
            emissionFactor: m.emissionFactor,
          },
        });
        this.logger.log(`Updated metric to Spanish: ${m.name}`);
      }
    }
  }

  async create(createMetricInput: CreateMetricInput) {
    return this.prisma.$transaction(async (tx) => {
      const metric = await tx.metric.create({
        data: createMetricInput,
      });

      if (createMetricInput.companyId) {
        await tx.companyMetric.create({
          data: {
            companyId: createMetricInput.companyId,
            metricId: metric.id,
            isActive: true,
          },
        });
      }

      return metric;
    });
  }

  findAll(companyId?: string) {
    return this.prisma.metric.findMany({
      where: {
        isActive: true,
        OR: [{ companyId: null }, { companyId: companyId }],
      },
    });
  }

  findOne(id: string) {
    return this.prisma.metric.findUnique({
      where: { id },
    });
  }

  async requestMetric(companyId: string, description: string) {
    return this.prisma.metricRequest.create({
      data: {
        companyId,
        description,
      },
      include: { company: true },
    });
  }
}
