import User from '../models/user.js'
import validation from "./validation.js"
import errorHandling from "./errorHandling.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const signup = async ( req, res, next ) => {
  validation( req )
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  try {
    const hashedPw = await bcrypt.hash( password, 12 )
    const user = new User({
      username,
      email,
      password: hashedPw
    } )
    await user.save()
    res.status( 201 ).json({
      message: 'User created!',
      userId: user._id
    })
  } catch ( err ) {
    errorHandling( err, next )
  }
}

export const login = async ( req, res, next ) => {
  const email = req.body.email
  const password = req.body.password

  try {
    const user = await User.findOne({ email })
    if ( !user ) {
      const error = new Error( 'A user with this email could not be found.' )
      error.statusCode = 401
      throw error
    }
    const isPasswordEqual = await bcrypt.compare( password, user.password )
    if ( !isPasswordEqual ) {
      const error = new Error( 'Wrong password!' )
      error.statusCode = 401
      throw error
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      'privat_secret_api',
      { expiresIn: '1h' }
    )
    res.status( 200 ).json( { token, userId: user._id.toString() })
  } catch ( err ) {
    errorHandling( err, next )
  }
}

export const getUserStatus = async ( req, res, next ) => {
  try {
    const user = await User.findById( req.userId );
    if ( !user ) {
      const error = new Error( 'User not found.' );
      error.statusCode = 404;
      throw error;
    }
    res.status( 200 ).json( { status: user.status });
  } catch ( err ) {
    errorHandling( err, next )
  }
};

export const updateUserStatus = async ( req, res, next ) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById( req.userId );
    if ( !user ) {
      const error = new Error( 'User not found.' );
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status( 200 ).json({ message: 'User updated.' });
  } catch ( err ) {
    errorHandling( err, next )
  }
};
