import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  const { messages } = await req.json(); // ✅ now receiving history

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    })),
  });

  return NextResponse.json({
    reply: response.choices[0].message.content,
  });
}
