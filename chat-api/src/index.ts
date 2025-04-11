import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { StreamChat } from "stream-chat";
import * as https from "https";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY || Bun.env.OPEN_ROUTER_API_KEY,
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore self-signed certificates
});

const app = new Hono();

const chatClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!,
  { httpsAgent: agent }
);

// Enable CORS for all routes
app.use("*", cors());

app.post("/user-register", async (c) => {
  const { name, email } = c.req.query();
  if (!name || !email) {
    return c.json(
      {
        message: "Name and Email are required",
      },
      400
    );
  }

  try {
    const userId = email.replace(/[^a-zA-Z0-9]/g, "_");

    const user = {
      id: userId,
      name,
      email,
      role: "user",
    };

    // Check if user already exists
    const existingUser = await chatClient.queryUsers({
      id: { $eq: userId },
    });

    if (!existingUser.users.length) {
      // Add user to Stream Chat
      await chatClient.upsertUser(user);
    }

    return c.json({
      message: "Success!",
      userId,
      name,
      email,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json(
      {
        message: "Error creating user",
        error: "An internal error occurred. Please try again later.",
      },
      500
    );
  }
});

app.post("/chat", async (c) => {
  const { userId, message } = c.req.query();

  if (!userId || !message) {
    return c.json(
      {
        error: "User ID and message are required",
      },
      400
    );
  }

  try {
    const userResponse = await chatClient.queryUsers({ id: userId });

    if (!userResponse.users.length) {
      return c.json(
        {
          error: "User not found",
        },
        404
      );
    }

    // Send message to openai
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiMessage =
      completion.choices[0].message.content || "No response from AI";

    // Create a channel
    const channel = chatClient.channel("messaging", `chat-${userId}`, {
      name: "AI Chat",
      created_by_id: "ai_bot",
    });

    await channel.create();
    await channel.sendMessage({
      text: aiMessage,
      user_id: "ai_bot",
    });

    return c.json({
      reply: aiMessage,
    });
  } catch (error) {
    console.error("Error generatin AI message:", error);
    return c.json(
      {
        message: "Error generatin AI message",
        error: "An internal error occurred. Please try again later.",
      },
      500
    );
  }
});

app.get("/", (c) => {
  const { PORT } = env<{ PORT: number }>(c);
  const port = PORT || 8000;

  return c.text(`Hello Hono! Listening on port ${port}`);
});

export default app;
