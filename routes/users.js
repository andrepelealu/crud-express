
const express = require('express')
// const app = express()
const router = express.Router()
const User = require('../models/user')
const helper = require('./helper')

// list all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// list one user
router.get('/:id', helper, (req, res) => {
    res.json(res.user)
})

// create a new user
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    })

    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// update a user
router.patch('/:id', helper, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name
    }
    if (req.body.email != null) {
        res.user.email = req.body.email
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

// delete a user
router.delete('/:id', helper, async (req, res) => {
    try {
        await res.user.remove()
        res.json({message: "user is deleted"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router
