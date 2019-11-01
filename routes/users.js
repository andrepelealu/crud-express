
const express = require('express')
// const app = express()
const router = express.Router()
const User = require('../models/user')
const helper = require('./helper')
const auth = require('./auth')


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
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})
// router.post('/login',async (req,res)=>{
//   try{
//     const {}
//   }
// })
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
        res.json({message: "berhasil dihapus"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/login',async (req,res)=>{
  try{
    const {email, password} = req.body
    const user = await User.findByCredentials(email, password)
    if(!user){
      return res.status(401).send({message: 'gagal'})
    }

    const token = await user.generateAuthToken()
    res.send({user,token})
  }catch(err){
    res.status(400).send({message: 'bad request'})
  }

  router.get('/me',auth,async(req,res)=>{
    res.send(req.user)
  })

  router.post('/me/logout',auth,async(req,res)=>{
    try{
      req.user.tokens = req.user.tokens.filter((token)=>{
        return token.token != req.token
      })
      await req.user.save()
      res.send()
    }catch (err){
      res.status(500).send(err)
    }
  })

})
module.exports = router
