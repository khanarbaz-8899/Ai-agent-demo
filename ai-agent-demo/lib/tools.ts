import { addToMemory, getMemory } from "./memory";

export const tools = {
  saveNote: async (text: string) => {
    addToMemory(text);
    return `✅ Note saved: "${text}"`;
  },

  getMemory: async () => {
    const mem = getMemory();
    if (mem.length === 0) return "Memory is empty.";
    return `🧠 Memory: ${mem.join(", ")}`;
  },

  getTime: async () => {
    return `⏰ Current time: ${new Date().toLocaleTimeString()}`;
  },
};
