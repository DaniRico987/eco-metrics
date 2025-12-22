import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ImpactRecord } from './models/impact-record.model';
import { ImpactRecordService } from './impact-record.service';
import { CreateImpactRecordInput } from './dto/create-impact-record.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { ICurrentUser } from '../common/interfaces/current-user.interface';

@Resolver(() => ImpactRecord)
@UseGuards(GqlAuthGuard)
export class ImpactRecordResolver {
  constructor(private service: ImpactRecordService) {}

  @Mutation(() => ImpactRecord)
  createImpactRecord(
    @Args('data') data: CreateImpactRecordInput,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.service.create(data, user.id, user.companyId);
  }

  @Query(() => [ImpactRecord])
  impactRecords(@CurrentUser() user: ICurrentUser) {
    return this.service.findAllByCompany(user.companyId);
  }

  @Query(() => ImpactRecord)
  impactRecord(@Args('id') id: string, @CurrentUser() user: ICurrentUser) {
    return this.service.findOne(id, user.companyId);
  }
}
