import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { ChatMessageInput } from './dto/chat-message.input';
import { MetricSuggestion } from './models/metric-suggestion.model';

@Resolver()
@UseGuards(GqlAuthGuard)
export class AiResolver {
  constructor(private aiService: AiService) {}

  @Query(() => String)
  async getAiInsight(
    @Args({ name: 'history', type: () => [ChatMessageInput] })
    history: ChatMessageInput[],
    @Args('context') context: string,
  ) {
    return this.aiService.getContextualInsight(history, context);
  }

  @Query(() => MetricSuggestion)
  async suggestMetricDetails(@Args('metricName') metricName: string) {
    return this.aiService.suggestMetricDetails(metricName);
  }
}
