import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ImpactValue } from './impact-value.model';

@ObjectType()
export class ImpactRecord {
  @Field()
  id: string;

  @Field(() => Int)
  month: number;

  @Field(() => Int)
  year: number;

  @Field(() => Float)
  totalImpact: number; // Calculated sum from values

  @Field(() => [ImpactValue])
  values: ImpactValue[];

  @Field()
  createdAt: Date;
}
