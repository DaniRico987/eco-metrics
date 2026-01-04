import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './models/company.model';
import { CompanyMetric } from './models/company-metric.model';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { ICurrentUser } from '../common/interfaces/current-user.interface';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private companiesService: CompaniesService) {}

  @Query(() => Company)
  @UseGuards(GqlAuthGuard)
  async myCompany(@CurrentUser() user: ICurrentUser) {
    return this.companiesService.findOne(user.companyId);
  }

  @Query(() => [Company], { name: 'companies' })
  async findAll() {
    return this.companiesService.findAll();
  }

  @Mutation(() => Company)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('COMPANY_MANAGER')
  async completeOnboarding(
    @CurrentUser() user: ICurrentUser,
    @Args('metricIds', { type: () => [String] }) metricIds: string[],
  ) {
    return this.companiesService.completeOnboarding(user.companyId, metricIds);
  }
  @Mutation(() => CompanyMetric)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('COMPANY_MANAGER')
  async toggleMetric(
    @CurrentUser() user: ICurrentUser,
    @Args('metricId') metricId: string,
  ) {
    return this.companiesService.toggleMetric(user.companyId, metricId);
  }
}
