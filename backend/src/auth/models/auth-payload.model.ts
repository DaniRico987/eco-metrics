import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class UserPayload {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field()
  companyId: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  user: UserPayload;
}
