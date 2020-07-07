const express = require('express')
const server = express()


server.use(express.json())
server.get("/", (req,res) => {
    res.send('<h2> API is online on port 8000 - FB </h2>')
})


const PORT = 8000;
server.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
})