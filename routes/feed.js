import express from 'express'
import * as feedController from '../controllers/feed.js'


export const feedRouter = express.Router()

feedRouter.get( '/posts', feedController.getPosts )

feedRouter.post( '/posts', feedController.createPost )
