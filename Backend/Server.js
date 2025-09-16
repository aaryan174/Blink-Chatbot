import "dotenv/config";
import express from "express";
import cors from "cors";
// import fetch if Node <18
// import fetch from "node-fetch";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";


const app = express();
const PORT = 8080;

// CORS configuration
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://blink-frontend.onrender.com", "https://blink-chatbot-1.onrender.com"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth/home", chatRoutes);
app.use("/api/auth", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const connectDB = async()=> {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("connected with database");
    
  } catch (error) {
    console.log("failed to connect wtih db", error);
    
  }
}


// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-goog-api-key": process.env.GEMINI_API_KEY,
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [{ text: req.body.message }],
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
//       options
//     );
//     const data = await response.json();
//     // console.log(data);

//     // res.json(data.candidates[0].content.parts[0].text); 
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });
