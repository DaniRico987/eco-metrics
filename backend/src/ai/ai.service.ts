import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Groq from 'groq-sdk';
import * as crypto from 'crypto';

export type AiRole = 'user' | 'ai' | 'assistant' | 'system';

export interface AiMessage {
  role: AiRole;
  content: string;
}

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  private generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async getContextualInsight(history: AiMessage[], context: string) {
    // 1. Caching Strategy: Hash of history + context
    const rawKey = JSON.stringify({ history, context });
    const cacheKey = `insight_${this.generateHash(rawKey)}`;

    const cached = await this.prisma.aiCache.findUnique({
      where: { key: cacheKey },
    });

    if (cached) {
      return (cached.response as any).content;
    }

    // 2. Separate Model Strategy: High intelligence for complex advice
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Eres el EcoAssistant, un experto en sostenibilidad amigable y directo.
          
          TU TONO:
          - Conversacional y humano (no robótico ni extremadamente formal).
          - Breve y conciso. Evita párrafos largos.
          
          CONTEXTO ACTUAL DEL DASHBOARD:
          ${context}
          
          REGLA CRÍTICA: Basa tus consejos en los datos del contexto.`,
        },
        ...history.map((msg) => ({
          role: (msg.role === 'ai' || msg.role === 'assistant'
            ? 'assistant'
            : 'user') as 'assistant' | 'user',
          content: msg.content,
        })),
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const result =
      chatCompletion.choices[0]?.message?.content ||
      'No se pudo generar una respuesta.';

    // Store in cache (expire in 1 hour)
    await this.prisma.aiCache
      .create({
        data: {
          key: cacheKey,
          response: { content: result },
          type: 'DASHBOARD_INSIGHT',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      })
      .catch(() => {});

    return result;
  }

  async suggestMetricDetails(metricName: string) {
    const normalizedName = metricName.toLowerCase().trim();
    const cacheKey = `suggestion_${normalizedName}`;

    // Persistent Cache Check
    const cached = await this.prisma.aiCache.findUnique({
      where: { key: cacheKey },
    });

    if (cached) {
      return cached.response;
    }

    // 2. Separate Model Strategy: Fast/Cheap model for extraction
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Eres un consultor experto en sostenibilidad y estándares de reporte de emisiones (GHG Protocol).
          
          OBJETIVO:
          Dada una métrica nueva, sugiere unidades de medida comunes y un factor de emisión promedio (kg CO2e por unidad).
          
          FORMATO DE SALIDA:
          JSON: { "units": ["u1"], "emissionFactor": 0.0, "description": "..." }`,
        },
        {
          role: 'user',
          content: `Métrica: ${metricName}`,
        },
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    try {
      const result = content
        ? JSON.parse(content)
        : {
            units: ['unidad'],
            emissionFactor: 0.0,
            description: 'No se pudo generar una sugerencia precisa.',
          };

      // Persistent Storage
      await this.prisma.aiCache
        .create({
          data: {
            key: cacheKey,
            response: result,
            type: 'METRIC_SUGGESTION',
          },
        })
        .catch(() => {});

      return result;
    } catch (e) {
      return {
        units: ['unidad'],
        emissionFactor: 0.0,
        description: 'No se pudo generar una sugerencia precisa.',
      };
    }
  }
}
