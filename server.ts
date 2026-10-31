import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health / status endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Adarsha Study Assistant API',
    model: 'gemini-3.8-flash',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Gemini Multi-turn Study Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userQuery, gradeLevel, subject } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please verify your GEMINI_API_KEY in server environment secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are "আদর্শ শিক্ষাসহায়িকা" (Adarsha Study Assistant) — a friendly, caring, encouraging, and intelligent educational tutor created for students (Play, Nursery, KG, Class 1 to Class 5) and parents of "আদর্শ শিশু কানন স্কুল" (Adarsha Shishu Kanan School), located in Kashim Bazar, Sundarganj, Gaibandha.

Primary Mission:
1. Help primary and pre-primary school students learn with clarity, joy, patience, and warmth.
2. Teach and explain concepts primarily in clear, natural Bengali (বাংলা), and also in English when learning English language or requested.
3. Solve and explain primary mathematics (প্রাথমিক গণিত) step-by-step with simple logic, relatable everyday examples (যেমন: চকলেট, মার্বেল, ফল, রঙিন পেন্সিল গণনা), and joyful breakdown.
4. Explain English grammar, vocabulary, spellings, Bengali-to-English translation, rhyming words, and simple sentence making.
5. Provide Bengali grammar (ব্যাকরণ - ভাষা, বর্ণ, শব্দ, বাক্য, বিপরীত শব্দ, সমার্থক শব্দ), short essays/paragraphs (রচনা ও অনুচ্ছেদ ধারণা), and poem recitation guidelines.
6. Provide Primary Science (প্রাথমিক বিজ্ঞান), Bangladesh & Global Studies (বাংলাদেশ ও বিশ্বপরিচয়), General Knowledge (সাধারণ জ্ঞান), and Moral/Islamic education (নৈতিক মূল্যবোধ ও ধর্মীয় শিক্ষা).
7. Help parents and guardians with daily study routines, homework checking tips, and positive motivation for children.
8. Tone: Highly affectionate, polite, respectful, and joyful (e.g., "ছোট্ট বন্ধুরা", "সোনামণি", "প্রিয় শিক্ষার্থী", "সম্মানিত অভিভাবক"). Use emojis thoughtfully to make learning delightful (🌟, 📚, ✏️, 💡, 👏, 🌈, 🌺).
9. Keep answers well-structured with clear bullet points, bold key terms, and numbered steps so young children and parents can read easily.
10. If asked about the school: "আদর্শ শিশু কানন স্কুল, কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা। ২০১১ সালে প্রতিষ্ঠিত একটি আধুনিক ও আদর্শ শিশু শিক্ষাপ্রতিষ্ঠান।"

Selected Grade Context: ${gradeLevel || 'প্রাথমিক বিদ্যালয় (প্লে থেকে ৫ম শ্রেণি)'}
Selected Subject Context: ${subject || 'সাধারণ শিক্ষা ও বাড়ির কাজ'}`;

    // Convert message history to Gemini API contents format:
    // [{ role: 'user' | 'model', parts: [{ text: string }] }]
    const rawContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      for (const msg of messages) {
        if (!msg || !msg.text || !msg.text.trim()) continue;
        const role: 'user' | 'model' = (msg.role === 'assistant' || msg.role === 'model') ? 'model' : 'user';
        rawContents.push({
          role,
          parts: [{ text: String(msg.text).trim() }],
        });
      }
    } else if (userQuery && typeof userQuery === 'string' && userQuery.trim()) {
      rawContents.push({
        role: 'user',
        parts: [{ text: userQuery.trim() }],
      });
    }

    if (rawContents.length === 0) {
      return res.status(400).json({ error: 'No messages provided to the tutor.' });
    }

    // Merge consecutive messages with the same role to strictly conform to Gemini multi-turn requirements
    const normalizedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    for (const c of rawContents) {
      if (normalizedContents.length > 0 && normalizedContents[normalizedContents.length - 1].role === c.role) {
        normalizedContents[normalizedContents.length - 1].parts[0].text += '\n\n' + c.parts[0].text;
      } else {
        normalizedContents.push({ role: c.role, parts: [{ text: c.parts[0].text }] });
      }
    }

    // Ensure first message is always from 'user'
    if (normalizedContents.length > 0 && normalizedContents[0].role !== 'user') {
      normalizedContents.unshift({
        role: 'user',
        parts: [{ text: 'আসসালামু আলাইকুম / নমস্কার। আমি পড়াশোনায় সহায়তা চাই।' }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: normalizedContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'দুঃখিত, কোনো উত্তর তৈরি করা সম্ভব হয়নি। অনুগ্রহ করে প্রশ্নটি আবার করুন।';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini Study Chatbot API Error:', error);
    const errorMessage = error?.message || 'পড়াশোনায় সহায়তা সার্ভারে সাময়িক ত্রুটি দেখা দিয়েছে। কিছুক্ষণ পর পুনরায় চেষ্টা করুন।';
    return res.status(500).json({
      error: errorMessage,
    });
  }
});

// Server entry point setup:
// In dev: mount Vite middlewares
// In prod: serve static dist files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Adarsha School Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
