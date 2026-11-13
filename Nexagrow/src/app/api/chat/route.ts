import { NextRequest, NextResponse } from 'next/server';
import { BRAND } from '@/lib/brand';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const BRAND_SYSTEM_PROMPT = `You are the friendly support assistant for ${BRAND.name}, an organic moringa and wellness brand. You help with:
- Product info: moringa powder, oil, capsules, leaves
- Orders, shipping, discounts (e.g. NEXA10 for 10% off, free shipping above ₹1499)
- Farm-to-table story, quality, and organic practices
Keep replies concise, helpful, and on-brand. If you don't know something, suggest they contact the team or visit the contact page.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chat not configured' }, { status: 503 });
    }

    const { message, history = [] } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const contents = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: message.trim() }] },
    ];

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };
    // systemInstruction is supported by Gemini 1.5; keeps system prompt out of conversation
    try {
      (body as { systemInstruction?: { parts: { text: string }[] } }).systemInstruction = {
        parts: [{ text: BRAND_SYSTEM_PROMPT }],
      };
    } catch {
      // ignore
    }

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const errText = await res.text();
    if (!res.ok) {
      console.error('Gemini API error:', res.status, errText);
      let errMessage = 'Could not get a response';
      try {
        const errJson = JSON.parse(errText);
        const msg = errJson?.error?.message ?? errJson?.message ?? '';
        if (msg) {
          const isQuotaOrRateLimit =
            /quota|billing|rate.limit|rate_limit|resource_exhausted/i.test(msg);
          errMessage = isQuotaOrRateLimit
            ? 'Our chat is temporarily at capacity. Please try again in a minute or contact us via the Contact page.'
            : msg;
        }
      } catch {
        // use default
      }
      const status = errText.toLowerCase().includes('quota') || errText.toLowerCase().includes('rate') ? 503 : 502;
      return NextResponse.json({ error: errMessage }, { status });
    }

    let data: { candidates?: { finishReason?: string; content?: { parts?: { text?: string }[] } }[] };
    try {
      data = JSON.parse(errText);
    } catch {
      return NextResponse.json({ error: 'Invalid response from assistant' }, { status: 502 });
    }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      const blockReason = data?.candidates?.[0]?.finishReason ?? data?.candidates?.[0]?.content?.parts?.[0];
      console.error('Gemini empty text:', JSON.stringify(data));
      return NextResponse.json(
        { error: blockReason ? `Assistant blocked or empty: ${JSON.stringify(blockReason)}` : 'No response from assistant' },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (e) {
    console.error('Chat API error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
