import express from 'express'
import { body } from 'express-validator'
import * as feedController from '../controllers/auth.js'
import User from '../models/user.js'


export const authRouter = express.Router()

authRouter.put(
  '/signup',
  [
    body( 'username' )
      .trim()
      .not()
      .isEmpty(),

    body( 'email' )
      .isEmail()
      .withMessage( 'Please enter a valid email' )
      .custom(( value, { req }) => {
        return User.findOne({ email: value })
          .then( userDoc => {
            if ( userDoc ) {
              return Promise.reject( 'E-mail address already exists!' )
            }
          })
      })
      .normalizeEmail(),

    body( 'password' )
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.signup
)
