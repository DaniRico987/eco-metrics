import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class MetricSuggestion {
  @Field(() => [String])
  units: string[];

  @Field(() => Float)
  emissionFactor: number;

  @Field()
  description: string;
}
