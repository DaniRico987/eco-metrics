import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ImpactRecord {
  @Field()
  id: string;

  @Field(() => Int)
  month: number;

  @Field(() => Int)
  year: number;

  @Field(() => Float)
  energyKwh: number;

  @Field(() => Float)
  waterM3: number;

  @Field(() => Float)
  wasteKg: number;

  @Field(() => Float)
  transportKm: number;

  @Field(() => Float)
  totalImpact: number;

  @Field()
  createdAt: Date;
}
