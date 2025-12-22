import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => User)
@UseGuards(GqlAuthGuard, RolesGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  @Roles('ADMIN')
  async findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'me' })
  async getMe(@CurrentUser() user: any) {
    return this.usersService.findOne(user.userId);
  }

  @Query(() => [User], { name: 'usersByCompany' })
  async findByCompany(@CurrentUser() user: any) {
    return this.usersService.findByCompany(user.companyId);
  }
}
