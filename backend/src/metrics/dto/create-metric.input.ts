import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateMetricInput {
  @Field()
  name: string;

  @Field()
  unit: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  icon: string;

  @Field()
  color: string;

  @Field(() => Float)
  emissionFactor: number;

  @Field({ nullable: true })
  companyId?: string;
}
