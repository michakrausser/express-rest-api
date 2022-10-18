import User from '../models/user.js'
import validation from "./validation.js"
import errorHandling from "./errorHandling.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const signup = ( req, res, next ) => {
  validation( req )
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  bcrypt.hash( password, 12 )
    .then( hashedPw => {
      const user = new User({
        username,
        email,
        password: hashedPw
      })
      return user.save()
    })
    .then( result => {
      res.status( 201 ).json({
        message: 'User created!',
        userId: result._id
      })
    })
    .catch( err => errorHandling( err, next ))
}

export const login = ( req, res, next ) => {
  const email = req.body.email
  const password = req.body.password
  let loadedUser

  User.findOne({ email })
    .then( user => {
      if ( !user ) {
        const error = new Error( 'A user with this email could not be found.' )
        error.statusCode = 401
        throw error
      }
      loadedUser = user
      return bcrypt.compare( password, user.password )
    })
    .then( isEqual => {
      if ( !isEqual ) {
        const error = new Error( 'Wrong password!' )
        error.statusCode = 401
        throw error
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'privat_secret_api',
        { expiresIn: '1h' }
      )
      res.status( 200 ).json({ token, userId: loadedUser._id.toString() })
    })
    .catch( err => errorHandling( err, next ))
}
