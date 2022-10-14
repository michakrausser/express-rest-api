import express from 'express'
import bodyParser from "body-parser";
import { feedRouter } from './routes/feed.js'
import { authRouter } from './routes/auth.js'
import mongoose from 'mongoose'
import multer from 'multer'


const app = express()
const storage = multer.diskStorage({
  destination: ( req, file, db ) => {
    db( null, 'images' )
  },
  filename: ( req, file, cb ) => {
    cb( null, new Date().toISOString() + '-' + file.originalname )
  }
})

const fileFilter = ( req, file, cb ) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb( null, true )
  } else {
    cb( null, false )
  }
}

app.use( bodyParser.json() ) // application/json Header
app.use( multer({ storage, fileFilter }).single('image' ))
app.use( '/images', express.static('images' ))
// Allow all url's that want to access
// Allow certain methods
// Allow content type and authenticate headers
app.use(( req, res, next ) => {
  res.setHeader( 'Access-Control-Allow-Origin', '*' )
  res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE' )
  res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type, Authorization' )
  next()
})
/*
 * app.use( bodyParser.urlencoded() )
 * using for x-www-form-urlencoded <form>
 */
app.use( '/feed', feedRouter )
app.use( '/auth', authRouter )

app.use(( err, req, res, next ) => {
  console.log( 'err: ', err );
  const status = err.statusCode || 500
  const message = err.message
  const data = err.data
  res.status( status ).json({ message, data })
})

mongoose.connect( 'mongodb+srv://michakrausser:TmxKks4YkzDEpN@feed-api.itmvxv9.mongodb.net/?retryWrites=true&w=majority' )
  .then( result => {
    app.listen( 8080 )
  })
  .catch( err => console.log( err ))

