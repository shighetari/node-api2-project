const express = require('express')
const router = express.Router()
const DB = require("../data/db")
//start of MVP


// POST | insert  
router.post("/", (req, res) => {
    DB.insert(req.body)
        .then(db => {
            // console.log(db)
            DB.findById(db.id)
                .then(dbinfo => {
                    console.log(dbinfo)
                    res.status(200).json(dbinfo)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
            if (!req.body.title || !req.body.contents) {
                res.status(400).json({
                    message: "Please provide title and contents for the post."
                })
            } else {
                res.status(500).json({
                    message: "There was an error while saving the post to the database"
                })
            }


        })
})

//POST :id/comments
router.post("/:id/comments", (req, res) => {
    const commentInfo = req.body
    const postId = req.params.id
    DB.insertComment(commentInfo)
        .then(comment => {
            // console.log(comment)

            DB.findCommentById(comment.id)
                .then(newComment => {
                    res.status(201).json({ data: newComment })
                })

        })
        .catch(err => {
            console.log(err)
            DB.findById(postId)
                .then(post => {
                    // console.log(post)
                    if (!req.body.text) {
                        res.status(400).json({ errorMessage: "Please provide text for the comment" })
                    } else if (!post.id) {
                        res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
                    } else {
                        res.status(500).json({ errorMessage: "There was an error while saving the comment to the database." })
                    }


                })
                .catch(err => {
                    console.log(err)

                })

        })
})

//GET Posts
router.get("/", (req, res) => {
    // res.send('<h2> POSTS API </h2>')
    DB.find(req.query)
        .then(db => {
            res.json({ db })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The posts information could not be retrieved." })
        })
})

//GET Posts by ID
router.get("/:id", (req, res) => {
    DB.findById(req.params.id)
        .then(db => {
            // console.log(db)
            if (!db[0]) { //if the array is empty return back this msg
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(db)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The post information could not be retrieved."
            })
        })
})

//GET /api/posts/:id/comments
router.get("/:id/comments", (req, res) => {
    const { id } = req.params

    DB.findPostComments(id)
        .then(comments => {
            console.log(comments) // comments is an array of empty objects by default, or an array of objects provided.
            if (!comments[0]) {
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json({ data: comments })
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: "The comments information could not be retrieved." })
        })
})



//DELETE (remove)
/* Removes the post with the specified id and returns the deleted post object. 
You may need to make additional calls to the database in order to satisfy this requirement. */
router.delete("/:id", (req, res) => {
    const deletedPost = req.params.id
    DB.remove(deletedPost)
        .then(post => {
            if (post > 0) {
                res.status(200).json({ message: "The post with the specified ID has been deleted. " })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        }).catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post could not be removed" })
        })
})

//PUT (update)
router.put("/:id", (req, res) => {
    const changes = req.body
    const post = req.params.id
    DB.update(post, changes)
        .then(updatedPost => {
            // console.log(changes)
            // console.log(updatedPost) //number of objects that are updated through the put operation 
            if (updatedPost) { //is updatedPost @ zero or undefined?
                res.status(200).json({ updatedPost, changes })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err)
            if (!changes.title || !changes.contents) {
                res.status(400).json({ message: "Please Provide a title and content for the post" })
            } else {
            res.status(500).json({ message: "The post information could not be modified." })
            }
        })
})



//export default router
module.exports = router