import Threads from "../models/Threads.js";
import getGeminiApiResponse from "../utils/GoogleGemini.js";

export async function getAllThreads(req, res) {
  try {
    const threads = await Threads.find().sort({ updatedAt: -1 }); 
    return res.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    return res.status(500).json({ error: "Failed to fetch threads" });
  }
}

export async function getChatHistory(req, res) {
  const { threadId } = req.params;
  try {
    const thread = await Threads.findOne({ ThreadId: threadId });
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    
    const safeMessages = thread.Message.map(msg => ({
      Role: msg.Role,
      Content: msg.Content.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }));

    return res.json(safeMessages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ error: "Failed to fetch thread chats" });
  }
}

export async function deleteChat(req, res) {
  const { threadId } = req.params;
  try {
    const deletedThread = await Threads.findOneAndDelete({ ThreadId: threadId });
    if (!deletedThread) return res.status(404).json({ error: "Thread not found" });
    return res.status(200).json({ success: "Thread deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete thread" });
  }
}

export async function chatRoute(req, res) {
  const { ThreadId, Message } = req.body;
  if (!ThreadId || !Message) return res.status(400).json({ error: "Missing required fields" });

  try {
    let thread = await Threads.findOne({ ThreadId });

    if (!thread) {
      thread = new Threads({
        ThreadId,
        Title: Message,
        Message: [{ Role: "user", Content: Message }],
      });
    } else {
      thread.Message.push({ Role: "user", Content: Message });
    }

    let modelReply;
    try {
      modelReply = await getGeminiApiResponse(Message);
    } catch (geminiError) {
      console.error("Gemini API failed, using fallback:", geminiError);
      
      // Provide more specific error messages
      let errorMessage = "I'm sorry, I'm having trouble connecting to the AI service right now.";
      
      if (geminiError.message.includes("Quota exceeded") || geminiError.message.includes("billing")) {
        errorMessage = "⚠️ Quota exceeded. Google requires a billing account to be linked for free tier access (no charges for free usage). Please link a billing account at: https://console.cloud.google.com/billing";
      } else if (geminiError.message.includes("API key") || geminiError.message.includes("Invalid")) {
        errorMessage = "⚠️ API key issue. Please check your GEMINI_API_KEY in the .env file.";
      } else if (geminiError.message.includes("not found")) {
        errorMessage = "⚠️ Model not found. Please check the GEMINI_MODEL in your .env file.";
      } else {
        errorMessage = `⚠️ ${geminiError.message}`;
      }
      
      modelReply = errorMessage;
    }
    
    thread.Message.push({ Role: "model", Content: modelReply });
    thread.UpdatedAtTime = new Date();

    await thread.save();
    return res.json({ reply: modelReply });
  } catch (error) {
    console.error("Chat route error:", error);
    
    // Return more specific error messages
    if (error.message.includes("GEMINI_API_KEY")) {
      return res.status(500).json({ error: "AI service configuration error. Please check API key." });
    } else if (error.message.includes("Gemini API error")) {
      return res.status(500).json({ error: "AI service temporarily unavailable. Please try again." });
    } else {
      return res.status(500).json({ error: "Failed to process chat message. Please try again." });
    }
  }
}

export default { getAllThreads, getChatHistory, deleteChat, chatRoute };



