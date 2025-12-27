import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Goal } from './models/goal.model';
import { CreateGoalInput } from './dto/create-goal.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { ICurrentUser } from '../common/interfaces/current-user.interface';

@Resolver(() => Goal)
@UseGuards(GqlAuthGuard, RolesGuard)
export class GoalsResolver {
  constructor(private goalsService: GoalsService) {}

  @Query(() => [Goal])
  myCompanyGoals(@CurrentUser() user: ICurrentUser) {
    return this.goalsService.findAllByCompany(user.companyId);
  }

  @Mutation(() => Goal)
  @Roles('COMPANY_MANAGER')
  upsertGoal(
    @Args('data') data: CreateGoalInput,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.goalsService.upsert(data, user.companyId);
  }
}
