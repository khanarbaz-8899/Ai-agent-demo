import { OpenAI } from "openai";
import { tools } from "./tools";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function agent(message: string): Promise<string> {
  try {
    // Check if message matches a tool command
    if (message.toLowerCase().startsWith("save note:")) {
      const note = message.replace(/save note:/i, "").trim();
      return await tools.saveNote(note);
    }

    if (message.toLowerCase() === "show memory") {
      return await tools.getMemory();
    }

    if (message.toLowerCase() === "what time is it?") {
      return await tools.getTime();
    }

    // Default: let LLM generate a response
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message?.content || "Sorry, I didn't get that.";
  } catch (error) {
    console.error("Agent error:", error);
    return "Error: Something went wrong with the agent.";
  }
}
