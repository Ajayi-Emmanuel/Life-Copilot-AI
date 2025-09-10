
import { GoogleGenAI, Type } from "@google/genai";
import { Task, AiAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    stressForecast: {
      type: Type.ARRAY,
      description: "An array of predicted stress levels for the next 7 days.",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "The date in YYYY-MM-DD format." },
          stressLevel: { type: Type.NUMBER, description: "A numerical stress score from 1 (low) to 10 (high)." }
        },
        required: ["date", "stressLevel"]
      }
    },
    recommendations: {
      type: Type.ARRAY,
      description: "Actionable recommendations to manage stress.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A short, catchy title for the recommendation." },
          text: { type: Type.STRING, description: "A detailed explanation of the recommendation." }
        },
        required: ["title", "text"]
      }
    }
  },
  required: ["stressForecast", "recommendations"]
};

export const getAIAnalysis = async (tasks: Task[]): Promise<AiAnalysis> => {
  const today = new Date().toISOString().split('T')[0];
  const prompt = `
    You are a 'Life Copilot' AI that helps students and professionals manage their workload and prevent burnout. 
    Your task is to analyze a list of tasks with due dates and predict the user's stress level over the next 7 days. 
    Also, provide actionable recommendations to manage the predicted stress.

    Today's date is ${today}.

    Here is the list of tasks the user needs to complete:
    ${JSON.stringify(tasks.filter(t => !t.completed), null, 2)}

    Based on this data, please provide a response in the specified JSON format.
    Consider the following factors in your analysis:
    - Task density: More tasks on a single day or consecutive days increase stress.
    - Deadline proximity: Tasks due sooner are more stressful.
    - Weekends: Assume stress is slightly lower on weekends (Saturday, Sunday) unless there are pressing deadlines.
    - Uncompleted tasks: Only consider tasks that are not marked as completed.
    - Cumulative effect: Stress can build up over several busy days and linger.

    Return ONLY a valid JSON object matching the schema. The forecast should cover the next 7 days starting from today.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson: AiAnalysis = JSON.parse(jsonText);
    
    // Ensure forecast has 7 days, padding if necessary
    const forecastMap = new Map(parsedJson.stressForecast.map(p => [p.date, p]));
    const fullForecast = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        if (forecastMap.has(dateStr)) {
            fullForecast.push(forecastMap.get(dateStr)!);
        } else {
            fullForecast.push({ date: dateStr, stressLevel: 1 }); // Default low stress
        }
    }

    return { ...parsedJson, stressForecast: fullForecast.slice(0, 7) };
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. Please check your API key and try again.");
  }
};
