import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    // This will be handled by the execution environment.
    // In a real app, you might want a more graceful fallback or UI message.
    console.error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const generateMemojiDescription = async (imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [
            imagePart,
            { text: "Describe the person in this image in detail, focusing on features that would be useful for creating a cartoon avatar or memoji. Describe their hair style and color, eye shape and color, face shape, glasses, facial hair, and expression. Be concise and descriptive." }
        ]},
    });
    return response.text;
};

export const generateMemojiImage = async (description: string): Promise<string> => {
    const prompt = `A 3D memoji style avatar of a person with ${description}. Pixar style, character portrait, colorful, clean details, centered, on a solid light gray background.`;
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
        },
    });
    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("Image generation failed or returned no images.");
};

export const generateMemojiBio = async (description: string): Promise<string> => {
    const prompt = `Based on this description of a person: "${description}", write a short, fun, and quirky one-paragraph bio for their memoji avatar. Make it sound like a character introduction in a fun animated movie.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};
