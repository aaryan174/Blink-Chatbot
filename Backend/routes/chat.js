import express from "express";
import Threads from "../models/Threads.js";
import userAuthMiddleware from "../middleware/Auth.middleware.js";
import { chatRoute, deleteChat, getAllThreads, getChatHistory } from "../controllers/thread.controller.js";



const router = express.Router();

// test route
router.post("/test", async (req, res) => {
  try {
    const thread = new Threads({
      ThreadId: "abc",
      Title: "Tesitng New Thread",
    });

    const response = await thread.save();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// get all threads
router.get("/threads", userAuthMiddleware, getAllThreads)

// get chat history in thread
router.get("/threads/:threadId", userAuthMiddleware, getChatHistory);

// delete thread history
router.delete("/threads/:threadId", userAuthMiddleware, deleteChat);

// chat route
router.post("/chat", userAuthMiddleware, chatRoute);


export default router;
