import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class UserPayload {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field()
  companyId: string;

  @Field()
  status: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  user: UserPayload;
}
