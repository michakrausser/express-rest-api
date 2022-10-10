import express from 'express'
import bodyParser from "body-parser";
import { feedRouter } from './routes/feed.js'


const app = express()

app.use( bodyParser.json() ) // application/json Header
// Allow all url's that want to access
// Allow certain methods
// Allow content type and authenticate headers
app.use(( req, res, next ) => {
  res.setHeader( 'Access-Control-Allow-Origin', '*' )
  res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST', 'PUT', 'PATCH', 'DELETE' )
  res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type', 'Authorization' )
  next()
})
/*
 * app.use( bodyParser.urlencoded() )
 * using for x-www-form-urlencoded <form>
 */
app.use( '/feed', feedRouter )

/*
app.use( logger( 'dev' ))
app.use( express.json() )
app.use( express.urlencoded( { extended: false }))
*/

app.listen( 8080 )
