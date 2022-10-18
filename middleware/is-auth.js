import jwt from 'jsonwebtoken'

export default ( req, res, next ) => {
  const bearerHeader = req.headers[ 'authorization' ]
  let bearerToken
  let decodedToken

  if ( typeof bearerHeader !== 'undefined' ) {
    bearerToken = bearerHeader.split( ' ' )[ 1 ]
  } else {
    const error = new Error( 'Not authenticated' )
    error.statusCode = 401
    throw error
  }

  try {
    decodedToken = jwt.verify( bearerToken, 'privat_secret_api' )
  } catch ( err ) {
    err.statusCode = 500
    throw err
  }
  if ( !decodedToken ) {
    const error = new Error( 'Not authenticated!' )
    error.statusCode = 401
    throw error
  }
  req.userId = decodedToken.userId
  next()
}
