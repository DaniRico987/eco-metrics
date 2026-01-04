import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MetricsService } from './metrics.service';
import { Metric } from './entities/metric.entity';
import { MetricRequest } from './models/metric-request.model';
import { CreateMetricInput } from './dto/create-metric.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { ICurrentUser } from '../common/interfaces/current-user.interface';

@Resolver(() => Metric)
@UseGuards(GqlAuthGuard, RolesGuard)
export class MetricsResolver {
  constructor(private readonly metricsService: MetricsService) {}

  @Mutation(() => Metric)
  @Roles(Role.COMPANY_MANAGER, Role.SUPER_ADMIN)
  createMetric(
    @CurrentUser() user: ICurrentUser,
    @Args('createMetricInput') createMetricInput: CreateMetricInput,
  ) {
    if (user.role === Role.COMPANY_MANAGER) {
      createMetricInput.companyId = user.companyId;
    }
    return this.metricsService.create(createMetricInput);
  }

  @Query(() => [Metric], { name: 'metrics' })
  findAll(@CurrentUser() user: ICurrentUser) {
    return this.metricsService.findAll(user.companyId);
  }

  @Query(() => Metric, { name: 'metric' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.metricsService.findOne(id);
  }

  @Mutation(() => MetricRequest)
  @Roles(Role.COMPANY_MANAGER)
  requestMetric(
    @CurrentUser() user: ICurrentUser,
    @Args('description') description: string,
  ) {
    return this.metricsService.requestMetric(user.companyId, description);
  }
}
