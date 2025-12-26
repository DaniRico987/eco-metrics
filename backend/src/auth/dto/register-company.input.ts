import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
class CompanyCreateInput {
  @Field()
  name: string;

  @Field()
  sector: string;

  @Field(() => Int)
  employeesCount: number;
}

@InputType()
class AdminCreateInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterCompanyInput {
  @Field(() => CompanyCreateInput)
  company: CompanyCreateInput;

  @Field(() => AdminCreateInput)
  admin: AdminCreateInput;
}
