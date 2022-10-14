import User from '../models/user.js'
import validation from "./validation.js"
import errorHandling from "./errorHandling.js"
import bcrypt from 'bcryptjs'


export const signup = ( req, res, next ) => {
  console.log( req.body );
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
    .catch( err => errorHandling() )
}
