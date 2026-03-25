import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log(apiKey);
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in your environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);

// 1. Define the strict rules for the AI
const proofreaderPrompt = `
You are a meticulous, professional copy editor. Your job is to proofread the provided text.

Strict Rules:
1. Fix all grammar, spelling, and punctuation errors.
2. Mend broken line breaks or strange spacing (common in document extraction).
3. Preserve the author\'s original tone and intent. Do NOT completely rewrite the text or add new ideas.
4. If the text is already perfect, leave it unchanged and state that no fixes were needed.

Output Requirements:
You must respond with ONLY a valid, raw JSON object. Do not include markdown formatting like \`\`\`json.
The JSON must follow this exact structure:
{
  "correctedText": "The fully corrected version of the text.",
  "changes": ["Fixed spelling of \'recieve\' to \'receive\'", "Added missing comma after introductory clause"]
}
`;

// 2. Initialize the model once for efficiency
const proofreaderModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  // model: "gemini-2.5-flash",
  systemInstruction: proofreaderPrompt,
  generationConfig: {
    responseMimeType: "application/json", // Forces the model to return pure JSON
  },
});

/**
 * Proofreads the given text using the Gemini AI model.
 * @param textToProofread The text to be proofread.
 * @returns A promise that resolves to an object containing the corrected text and a list of changes.
 */
export const proofreadText = async (textToProofread: string): Promise<{ correctedText: string; changes: string[] }> => {
  try {
    const result = await proofreaderModel.generateContent(textToProofread);
    const response = result.response;
    const jsonString = response.text();

    // The model is configured to return JSON, so we can parse it directly.
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error proofreading text:", error);
    // Propagate the error to be handled by the calling component
    throw new Error("Failed to get proofreading suggestions from the AI.");
  }
};
