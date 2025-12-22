import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ICurrentUser } from '../interfaces/current-user.interface';

export const CurrentUser = createParamDecorator(
  (_data: ICurrentUser, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
