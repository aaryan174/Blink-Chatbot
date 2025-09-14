import Threads from "../models/Threads.js";
import getGeminiApiResponse from "../utils/GoogleGemini.js";

export async function getAllThreads(req, res) {
  try {
    // Only get threads for the authenticated user
    const threads = await Threads.find({ user: req.user._id }).sort({ UpdatedAtTime: -1 });
    return res.json(threads);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch threads" });
  }
}

export async function getChatHistory(req, res) {
  const { threadId } = req.params;
  try {
    // Only get thread if it belongs to the authenticated user
    const thread = await Threads.findOne({ ThreadId: threadId, user: req.user._id });
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    return res.json(thread.Message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch thread chats" });
  }
}

export async function deleteChat(req, res) {
  const { threadId } = req.params;
  try {
    // Only delete thread if it belongs to the authenticated user
    const deletedThread = await Threads.findOneAndDelete({ ThreadId: threadId, user: req.user._id });
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
    // Only find threads that belong to the authenticated user
    let thread = await Threads.findOne({ ThreadId, user: req.user._id });

    if (!thread) {
      thread = new Threads({
        ThreadId,
        Title: Message,
        Message: [{ Role: "user", Content: Message }],
        user: req.user._id, // Associate thread with user
      });
    } else {
      thread.Message.push({ Role: "user", Content: Message });
    }

    let modelReply;
    try {
      modelReply = await getGeminiApiResponse(Message);
    } catch (geminiError) {
      console.error("Gemini API failed, using fallback:", geminiError);
      // Fallback response when Gemini API is not available
      modelReply = "I'm sorry, I'm having trouble connecting to the AI service right now. Please make sure the GEMINI_API_KEY is properly configured in the environment variables. You can still use the chat interface, but AI responses are temporarily unavailable.";
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



