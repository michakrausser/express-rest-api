import { validationResult } from "express-validator"


export default ( req, imageValidation = false ) => {
  const errors = validationResult( req )
  console.log( errors );
  if ( !errors.isEmpty() ) {
    const error = new Error( 'Validation failed!' )
    error.statusCode = 422
    throw error
  }
  if ( imageValidation && !req.file ) {
    const error = new Error( 'No image provided!' )
    error.statusCode = 422
    throw error
  }
}
