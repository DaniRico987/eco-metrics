import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './models/company.model';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private companiesService: CompaniesService) {}

  @Query(() => Company)
  @UseGuards(GqlAuthGuard)
  async myCompany(@CurrentUser() user: any) {
    return this.companiesService.findOne(user.companyId);
  }
}
