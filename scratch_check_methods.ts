import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'test' });
console.log("ai.models is", typeof ai.models);
// console.log("ai.models.generateContent is", typeof ai.models?.generateContent); // This might throw if models is undefined
if (ai.models) {
    console.log("ai.models.generateContent is", typeof ai.models.generateContent);
} else {
    console.log("ai.models is undefined");
}
