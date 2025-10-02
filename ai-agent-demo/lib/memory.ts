// Simple in-memory storage (good for demo)
let memory: string[] = [];

export function addToMemory(entry: string) {
  memory.push(entry);
}

export function getMemory() {
  return memory;
}
