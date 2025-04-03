// pages/api/chat.ts
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { message, topic, words } = await req.json();

  const prompt = `
You are an AI English tutor.  
Your task is to have a casual conversation about **${topic}** with the user. Use some of the words from the list below in your responses. You don't need to use all of them, just one or two in each response.  
Whenever you use one of these words, provide its Chinese meaning in parentheses. Also, choose two slightly more difficult words from the list and provide their Chinese meanings as well.  
Keep the conversation light, friendly, and fun! Try to engage the user by asking questions related to the topic.35 to 40 words are enough!

Here are the words: **${words.join(", ")}**
  `;

  const aiResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: prompt }, { role: "user", content: message }] }),
  });

  const data = await aiResponse.json();
  return NextResponse.json({ reply: data.choices[0].message });
}