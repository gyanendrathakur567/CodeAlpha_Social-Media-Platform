const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Render provides the PORT environment variable.
// 5001 is used when running locally.
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: "*"
}));

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// MOCK DATABASE
// ===============================

const users = [];

const posts = [
    {
        id: 1,
        author: "CodeAlpha Admin",
        content: "Welcome to your new Social Media Platform internship project! 🚀",
        likes: 5,
        comments: ["Awesome job!", "Looks clean!"]
    }
];

// ===============================
// AUTHENTICATION
// ===============================

app.post("/api/auth/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Fields cannot be empty"
        });
    }

    if (users.find(u => u.username === username)) {
        return res.status(400).json({
            message: "Username taken"
        });
    }

    users.push({
        username,
        password
    });

    res.status(201).json({
        message: "Registration successful!"
    });
});

app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    res.status(200).json({
        message: "Welcome back!",
        user: username
    });
});

// ===============================
// SOCIAL MEDIA ROUTING
// ===============================

app.get("/api/posts", (req, res) => {
    res.json(posts);
});

app.post("/api/posts/create", (req, res) => {
    const { author, content } = req.body;

    if (!content) {
        return res.status(400).json({
            message: "Post content cannot be empty"
        });
    }

    const newPost = {
        id: posts.length + 1,
        author,
        content,
        likes: 0,
        comments: []
    };

    posts.unshift(newPost);

    res.status(201).json(newPost);
});

app.post("/api/posts/like", (req, res) => {
    const { postId } = req.body;

    const post = posts.find(
        p => p.id === parseInt(postId)
    );

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    post.likes += 1;

    res.json(post);
});

app.post("/api/posts/comment", (req, res) => {
    const { postId, commentText } = req.body;

    const post = posts.find(
        p => p.id === parseInt(postId)
    );

    if (!post || !commentText) {
        return res.status(400).json({
            message: "Failed to add comment"
        });
    }

    post.comments.push(commentText);

    res.json(post);
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "ConnectHub backend is running"
    });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ConnectHub server running on port ${PORT}`);
});