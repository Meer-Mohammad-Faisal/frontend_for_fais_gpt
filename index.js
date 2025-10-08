require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const Chat = require('./models/Chat');
const main = require('./aichat');

const app = express();
app.use(express.json());
app.use(express.static("public"));


// Connect MongoDB
connectDB();


app.post('/chat', async (req, res) => {
  try {
    const { id, msg } = req.body;
    if (!id || !msg) return res.status(400).send("User ID and message are required");

    // Fetch previous chat history
    const previousChats = await Chat.find({ userId: id });

    // Convert to Gemini format
    const promptmessage = [
      ...previousChats.map(chat => ({
        role: chat.role,
        parts: [{ text: chat.message }]
      })),
      { role: 'user', parts: [{ text: msg }] }
    ];

    // Send to Gemini API
    const answer = await main(promptmessage);

    // Save user and model messages
    await Chat.create({ userId: id, role: 'user', message: msg });
    await Chat.create({ userId: id, role: 'model', message: answer });

    res.send({ reply: answer });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));