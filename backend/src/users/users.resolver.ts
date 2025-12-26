import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStatus } from './models/user.model';
import { Mutation, Args } from '@nestjs/graphql';
import type { ICurrentUser } from '../common/interfaces/current-user.interface';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => User)
@UseGuards(GqlAuthGuard, RolesGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  @Roles('SUPER_ADMIN')
  async findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'me' })
  async getMe(@CurrentUser() user: any) {
    return this.usersService.findOne(user.userId);
  }

  @Query(() => [User], { name: 'usersByCompany' })
  async findByCompany(@CurrentUser() user: ICurrentUser) {
    return this.usersService.findByCompany(user.companyId);
  }

  @Query(() => [User], { name: 'pendingUsers' })
  @Roles('COMPANY_MANAGER')
  async findPending(@CurrentUser() user: ICurrentUser) {
    return this.usersService.findPendingByCompany(user.companyId);
  }

  @Mutation(() => User)
  @Roles('COMPANY_MANAGER')
  async approveUser(
    @Args('userId') userId: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.usersService.updateStatus(userId, UserStatus.ACTIVE, user);
  }

  @Mutation(() => User)
  @Roles('COMPANY_MANAGER')
  async rejectUser(
    @Args('userId') userId: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.usersService.updateStatus(userId, UserStatus.REJECTED, user);
  }
}
