import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;

  @Field()
  companyId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
