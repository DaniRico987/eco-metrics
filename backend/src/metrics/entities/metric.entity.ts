import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class Metric {
  @Field()
  id: string;

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

  @Field()
  isActive: boolean;
}
