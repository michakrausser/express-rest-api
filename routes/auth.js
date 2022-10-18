import express from 'express'
import { body } from 'express-validator'
import * as authController from '../controllers/auth.js'
import User from '../models/user.js'
import isAuth from "../middleware/is-auth.js"


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
      .custom( ( value, { req }) => {
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
  authController.signup
)

authRouter.post( '/login', authController.login )

authRouter.get('/status', isAuth, authController.getUserStatus )

authRouter.patch(
  '/status',
  isAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.updateUserStatus
)
