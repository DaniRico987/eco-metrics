import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChatMessageInput {
  @Field()
  role: string; // 'user' | 'assistant' | 'system'

  @Field()
  content: string;
}
