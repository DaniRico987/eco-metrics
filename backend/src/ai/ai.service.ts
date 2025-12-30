import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

export type AiRole = 'user' | 'ai' | 'assistant' | 'system';

export interface AiMessage {
  role: AiRole;
  content: string;
}

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  async getContextualInsight(history: AiMessage[], context: string) {
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Eres el EcoAssistant, un experto en sostenibilidad amigable y directo.
          
          TU TONO:
          - Conversacional y humano (no robótico ni extremadamente formal).
          - Breve y conciso. Evita párrafos largos a menos que el usuario pida un análisis detallado.
          - Empático. Si el usuario dice algo simple, responde de forma natural.
          
          REGLAS DE INTERACCIÓN:
          - NO repitas las métricas del contexto en cada respuesta si ya las mencionaste.
          - Si el usuario te da información nueva, incorpórala a tu lógica.
          - Actúa como un compañero, no como un auditor.
          
          CONTEXTO ACTUAL DEL DASHBOARD:
          ${context}
          
          REGLA CRÍTICA: Basa tus consejos en los datos del contexto pero prioriza la brevedad y naturalidad.`,
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

    return (
      chatCompletion.choices[0]?.message?.content ||
      'No se pudo generar una respuesta.'
    );
  }
}
