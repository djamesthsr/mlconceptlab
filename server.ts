import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Endpoint: Generate immersive Scientist Briefing
app.post("/api/generate-brief", async (req, res) => {
  try {
    const { userName } = req.body;
    const ai = getAI();
    const name = userName || "Agent Scientist";

    const prompt = `You are the Director of the AI Innovation Research Lab. Write a highly engaging, scientific, and motivating mission briefing for our newly appointed Machine Learning Scientist: ${name}.
The theme is "Machine Learning Concepts" (Module 4).
Cover the following exciting aspects:
- Congratulate them on joining the AI Lab.
- Introduce the quest: We are investigating how machines learn through real-world datasets, AI simulations, and feedback.
- Briefly mention the three Lab doors they will investigate: Supervised Learning (labeled examples), Unsupervised Learning (finding hidden structures), and Reinforcement Learning (trial and error with rewards).
- Keep the tone immersive, professional, and full of agency (avoiding corporate fluff, focus on raw scientific exploration).
- Format: Keep it to about 3 brief paragraphs. Use structured headings if necessary, but keep it clear and scannable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the immersive sci-fi Director of the AI Innovation Research Lab. Speak with crisp, intelligent authority.",
      }
    });

    res.json({ brief: response.text });
  } catch (error: any) {
    console.error("Error generating brief:", error);
    res.json({
      brief: `### MISSION BRIEF RECEIVED
Welcome to the AI Innovation Research Lab. As our newly appointed Machine Learning Scientist, you are tasked with investigating the core pathways of machine cognition. 

We will explore three distinct laboratory environments:
1. **Supervised Learning Lab** (analyzing structured datasets with labeled outcomes)
2. **Unsupervised Learning Lab** (discovering hidden groups and patterns in cluster sets)
3. **Reinforcement Learning Arena** (training self-optimizing agents using trial, error, and strategic feedback loops).

Your evidence board is prepared. Stand by for active calibration. Let us unlock the algorithms that shape our world.`,
      error: error.message
    });
  }
});

// AI Endpoint: Adaptive mentor feedback on specific decisions or essays
app.post("/api/mentor-feedback", async (req, res) => {
  try {
    const { activity, data } = req.body;
    const ai = getAI();

    let prompt = "";
    if (activity === "investigation") {
      prompt = `Review the ML Consultant decisions made by the student.
Organization: ${data.org}
Problem Description: ${data.problem}
Student's Recommended Approach: ${data.choice} (Correct Answer is: ${data.correctAnswer})

Provide immediate, engaging feedback from an expert AI Research Mentor.
Explain WHY this choice is correct or incorrect in a friendly, pedagogical, yet highly scientific way.
If correct, praise their technical judgment. If incorrect, kindly explain the difference (e.g. why Supervised fits labels while Unsupervised fits grouping without labels) and guide them to understand the right concept.
Keep it under 3-4 sentences.`;
    } else if (activity === "reflection") {
      prompt = `Review this student's short essay answers regarding Machine Learning:
Question: ${data.question}
Student's Response: "${data.response}"

Provide a brief, encouraging, and intellectually engaging feedback comment from an AI Research Mentor. 
Validate their thoughts, make a scientific connection to their response, and motivate them to keep exploring. Keep it to 2-3 sentences max.`;
    } else {
      res.status(400).json({ error: "Invalid activity type" });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the chief AI Research Mentor. Your tone is supportive, academically rigorous, and inspiring.",
      }
    });

    res.json({ feedback: response.text });
  } catch (error: any) {
    console.error("Error generating mentor feedback:", error);
    res.json({
      feedback: "Your analytical approach is noted, Scientist. Data patterns show that your logic is well-aligned with modern machine learning paradigms. Continue calibrating your models.",
      error: error.message
    });
  }
});

// AI Endpoint: Personalized Mission Report
app.post("/api/mission-report", async (req, res) => {
  const { userName, score, answers, reflection } = req.body;
  try {
    const ai = getAI();

    const prompt = `Generate a personalized, comprehensive, and highly encouraging AI Research Lab Report for ML Scientist: ${userName || "Student"}.
Here are the student's metrics from their Module 4 activities:
- Knowledge Check Score: ${score}%
- Performance in ML Consultant investigation: 100% completed
- Dataset Detective Drag & Drop: Completed
- Workflow Arrangement challenge: Completed
- Reflective responses provided for the Machine Learning Journey.

Write a custom feedback summary (3 paragraphs) that:
1. Highlights their key strengths (e.g., strong reasoning, excellent analytical abilities, or a great grasp of reinforcement learning based on their answers).
2. Recommends one primary Machine Learning concept they should revisit or deepen their understanding of before moving on to Module 5 (the AI Project Cycle).
3. Concludes with an inspiring congratulatory statement about unlocking their 🧠 Machine Learning Scientist badge.
Ensure the tone is scientific, warm, professional, and personalized. Make it feel like a real evaluation from the Director of the AI Lab.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the Director of the AI Innovation Research Lab. Speak with custom encouragement, clarity, and intellectual polish.",
      }
    });

    res.json({ report: response.text });
  } catch (error: any) {
    console.error("Error generating mission report:", error);
    res.json({
      report: `### PERSONALIZED LAB EVALUATION
**To:** ML Scientist ${userName || "Name"}  
**Status:** Certified ML Scientist  

Your performance across all diagnostic modules indicates a robust grasp of machine learning concepts. You successfully navigated the Supervised, Unsupervised, and Reinforcement Learning environments, demonstrating excellent capacity in data categorization and consultive modeling.

**Recommended Area of Calibration:** Prior to embarking on Module 5 (the AI Project Cycle), we recommend reviewing the precise boundaries of Unsupervised Clustering as it applies to real-time marketing segmentation, to further refine your architectural selection skills.

Congratulations on unlocking the **🧠 Machine Learning Scientist Badge** and securing 120 XP. Your expertise is a vital asset to our Research Lab.`,
      error: error.message
    });
  }
});

// Setup Vite Dev Server / Static Assets Serving
const initServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production build from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
};

initServer().catch((err) => {
  console.error("Failed to start server:", err);
});
