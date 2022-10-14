import Post from '../models/post.js'
import validation from "./validation.js"
import errorHandling from './errorHandling.js'
import fs from 'fs'


export const getPosts = ( req, res, next ) => {
  const currentPage = req.query.page || 1
  const perPage = 2
  let totalItems
  Post.find()
    .countDocuments()
    .then( count => {
      totalItems = count
      return Post.find()
        .skip(( currentPage - 1 ) * perPage )
        .limit( perPage )
    })
    .then( posts => {
      res.status( 200 ).json({
        message: 'Fetched posts successfully.',
        posts,
        totalItems
      })
    })
    .catch( err => errorHandling( err, next ))

}

export const createPost = ( req, res, next ) => {
  console.log( 'file: ', req.file );
  validation( req, true )
  const imageUrl = req.file.path
  const title = req.body.title
  const content = req.body.content

  const post = new Post({
    title,
    imageUrl,
    content,
    creator: { name: 'Micha' }
  })
  post.save()
    .then( result => {
      res.status( 201 ).json({
        message: 'Post created successfully',
        post: result
      })
    })
    .catch( err => errorHandling( err, next ))
}

export const getPost = ( req, res, next ) => {
  const postId = req.params.postId
  Post.findById( postId )
    .then( post => {
      if ( !post ) ifNoPost()
      res.status( 200 ).json({ message: 'Post fetched', post })
    })
    .catch( err => errorHandling( err, next ))
}

export const updatePost = ( req, res, next ) => {
  console.log( 'body: ', req.body );
  const postId = req.params.postId
  validation( req )
  const title = req.body.title
  const content = req.body.content
  let imageUrl = req.body.image
  if ( req.file ) {
    imageUrl = req.file.path
  }
  Post.findById( postId )
    .then( post => {
      if ( !post ) ifNoPost()
      if ( imageUrl !== post.imageUrl ) {
        clearImage( post.imageUrl )
      }
      post.title = title
      post.imageUrl = imageUrl
      post.content = content
      return post.save()
    })
    .then( result => {
      res.status( 200 ).json({ message: 'Post updated', post: result })
    })
    .catch( err => errorHandling( err, next ))
}

export const deletePost = ( req, res, next ) => {
  console.log( 'params: ', req.params );
  const postId = req.params.postId
  Post.findById( postId )
    .then( post => {
      // Check logged in user
      if ( !post ) ifNoPost()
      clearImage( post.imageUrl )
      return Post.findByIdAndRemove( postId )
    })
    .then( result => {
      res.status( 200 ).json({ message: 'Deleted post!' })
    })
    .catch( err => errorHandling( err, next ))
}

const clearImage = filePath => {
  fs.unlink( filePath, err => console.log( err ))
}

function ifNoPost() {
  const error = new Error( 'Could not find post.' )
  error.statusCode = 404
  throw error
}

