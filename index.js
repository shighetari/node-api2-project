const express = require('express')
const server = express()
const postsRouter = require("./posts/posts-router")
const messageRouter = require("./messages/messages-router")

server.use(express.json())

server.get("/", (req, res) => {
    res.send('<h2> API is online on port 8000 - FB </h2>')
})


server.use("/api/posts", postsRouter)
server.use("/api/messages", messageRouter)

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})