const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
  name :{
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: value => {
      if(!validator.isEmail(value)) {
        throw new Error({error: 'invalid email address'})
      }
    }
  },
  created_at:{
    type: Date,
    required: true,
    default: Date.now
  },
  password:{
    type: String,
    required: true,
    minLength: 7
  },
  tokens:[{
    token: {
      type: String,
      required: true
    }
  }

  ]

})

userSchema.pre('save', async function(next){
  const user = this
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.methods.generateAuthToken = async function(){
  const user = this
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password)=>{
  const user = await User.findOne({email})
  if(!user) {
    throw new Error({error: 'invalid login'})
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if(!isPasswordMatch) {
    throw new Error({error: 'invalid login'})
  }
  return user
}
const User = mongoose.model('User', userSchema)

module.exports = User
// module.exports = mongoose.model('User', userSchema)
