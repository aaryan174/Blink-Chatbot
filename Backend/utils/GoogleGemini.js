import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

// Cache for available models
let availableModels = null;

// Function to get available models from API
const getAvailableModels = async (apiKey) => {
  if (availableModels) return availableModels;
  
  try {
    // Fetch available models directly from the API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.models && Array.isArray(data.models)) {
        // Filter for models that support generateContent and are gemini models
        availableModels = data.models
          .filter(m => 
            m.name && 
            m.name.includes('gemini') && 
            !m.name.includes('embedding') &&
            m.supportedGenerationMethods?.includes('generateContent')
          )
          .map(m => {
            // Extract model name (e.g., "models/gemini-1.5-flash" -> "gemini-1.5-flash")
            const name = m.name.split('/').pop();
            return name;
          })
          .filter(Boolean);
        
        console.log("📋 Available models:", availableModels);
        return availableModels;
      }
    } else {
      console.log("⚠️ Could not fetch models list, status:", response.status);
    }
  } catch (error) {
    console.log("⚠️ Could not list models:", error.message);
  }
  return null;
};

const getGeminiApiResponse = async (Message) => {

  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set in environment variables");
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  console.log("✅ GEMINI_API_KEY found, length:", process.env.GEMINI_API_KEY.length);

  const apiKey = process.env.GEMINI_API_KEY.trim();
  
  // Get available models from API
  const models = await getAvailableModels(apiKey);
  
  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // List of models to try in order
  const modelsToTry = process.env.GEMINI_MODEL 
    ? [process.env.GEMINI_MODEL]
    : models 
      ? models.filter(m => m.includes('gemini') && !m.includes('embedding'))
      : ['gemini-1.5-flash-exp', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];

  let lastError = null;
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`📤 Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(Message);
      const response = await result.response;
      const text = response.text();
      console.log(`✅ Successfully got response from Gemini API (model: ${modelName})`);
      return text;
    } catch (error) {
      console.log(`⚠️ Model ${modelName} failed: ${error.message}`);
      lastError = error;
      continue; // Try next model
    }
  }
  
  // If all models failed, throw the last error with helpful message
  if (lastError) {
    console.error("❌ All models failed. Last error:", lastError.message);
    
    // Provide more helpful error messages
    if (lastError.message.includes("429") || lastError.message.includes("quota") || lastError.message.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Quota exceeded. Please check your Google Cloud billing account. Free tier requires a billing account to be linked (no charges for free tier usage). Visit: https://console.cloud.google.com/billing");
    } else if (lastError.message.includes("API_KEY_INVALID") || lastError.message.includes("401")) {
      throw new Error("Invalid API key. Please check your GEMINI_API_KEY in the .env file.");
    } else if (lastError.message.includes("404") || lastError.message.includes("not found")) {
      const available = availableModels ? ` Available models: ${availableModels.join(', ')}` : '';
      throw new Error(`No available Gemini models found.${available} Please check your API key permissions or enable billing.`);
    }
    
    throw lastError;
  }
  
  throw new Error("No models available to try");
};

export default getGeminiApiResponse;
