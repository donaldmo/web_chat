const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const cors = require('cors');

app.use(cors());

// Serve static files (React build) from the 'client/build' folder
app.use(express.static('client/build'));

// Handle requests to the root URL by serving the React build index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
});

const rooms = {};

io.on("connection", socket => {
  socket.on("join room", roomID => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }

    const otherUser = rooms[roomID].find(id => id !== socket.id);

    if (otherUser) {
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
    }
  });

  socket.on("offer", payload => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", payload => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", incoming => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });
});

// Start the server on port 8000
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
