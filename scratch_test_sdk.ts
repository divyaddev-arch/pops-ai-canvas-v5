import { GoogleGenAI } from '@google/genai';

try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    console.log("Initialization successful without explicit key (maybe uses process.env)");
} catch (e) {
    console.error("Initialization failed without explicit key:", e);
}

try {
    const ai = new GoogleGenAI({ apiKey: 'test' });
    console.log("Initialization successful with explicit key");
} catch (e) {
    console.error("Initialization failed with explicit key:", e);
}
