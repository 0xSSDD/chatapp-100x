const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

// Define a mapping of words to emojis
const wordToEmoji = {
  react: "⚛️",
  woah: "😲",
  hey: "👋",
  lol: "😂",
  like: "🤍",
  congratulations: "🎉",
};

// Function to replace words with emojis in a message
function replaceWordsWithEmojis(message) {
  const words = message.split(" ");
  const replacedWords = words.map((word) => {
    if (word.toLowerCase() in wordToEmoji) {
      return wordToEmoji[word.toLowerCase()] + " ";
    }
    return word + " ";
  });
  return replacedWords.join("").trim();
}

io.on('connection', (socket) => {
  console.log('a user connected');

  // Listen for messages
  socket.on('chat message', (message) => {
    const messageWithEmojis = replaceWordsWithEmojis(message); // Replace words with emojis
    io.emit('chat message', messageWithEmojis); // Broadcast the message to everyone
    console.log('message: ' + messageWithEmojis);
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
