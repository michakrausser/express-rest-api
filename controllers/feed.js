import Post from '../models/post.js'
import User from '../models/user.js'
import validation from "./validation.js"
import errorHandling from './errorHandling.js'
import fs from 'fs'


export const getPosts = async ( req, res, next ) => {
  const currentPage = req.query.page || 1
  const perPage = 2
  try {
    const totalItems = await Post.find().countDocuments()
    const posts = await Post.find()
      .populate( 'creator' )
      .skip(( currentPage - 1 ) * perPage )
      .limit( perPage )
    res.status( 200 ).json({
      message: 'Fetched posts successfully.',
      posts,
      totalItems
    })
  } catch ( err ) {
    errorHandling( err, next )
  }
}

export const createPost = async ( req, res, next ) => {
  validation( req, true )
  const imageUrl = req.file.path
  const title = req.body.title
  const content = req.body.content

  const post = new Post({
    title,
    imageUrl,
    content,
    creator: req.userId
  })

  try {
    await post.save()
    const user = await User.findById( req.userId )
    user.posts.push( post )
    await user.save()
    res.status( 201 ).json({
      message: 'Post created successfully',
      post,
      creator: { _id: user._id, username: user.username }
    })
  } catch ( err ) {
    errorHandling( err, next )
  }
}

export const getPost = async ( req, res, next ) => {
  const postId = req.params.postId
  try {
    const post = await Post.findById( postId )
    if ( !post ) ifNoPost()
    res.status( 200 ).json({ message: 'Post fetched', post })
  } catch ( err ) {
    errorHandling( err, next )
  }
}

export const updatePost = async ( req, res, next ) => {
  const postId = req.params.postId
  validation( req )
  const title = req.body.title
  const content = req.body.content
  let imageUrl = req.body.image
  if ( req.file ) {
    imageUrl = req.file.path
  }

  try {
    const post = await Post.findById( postId )
    if ( !post ) ifNoPost()
    if ( post.creator.toString() !== req.userId ) hasNoPermissions()
    if ( imageUrl !== post.imageUrl ) clearImage( post.imageUrl )
    post.title = title
    post.imageUrl = imageUrl
    post.content = content
    await post.save()
    res.status( 200 ).json({ message: 'Post updated', post })
  } catch ( err ) {
    errorHandling( err, next )
  }
}

export const deletePost = async ( req, res, next ) => {
  const postId = req.params.postId
  try {
    const post = await Post.findById( postId )
    if ( !post ) ifNoPost()
    if ( post.creator.toString() !== req.userId ) hasNoPermissions()

    // find post under user and delete it
    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { posts: { $in: [ postId ] }}},
      { new: true }
    )

    clearImage( post.imageUrl )

    // delete Post from POSTS collection
    await Post.findByIdAndRemove( postId )
    res.status( 200 ).json({ message: 'Deleted post!' })
  } catch( err ) {
    errorHandling( err, next )
  }
}

const clearImage = filePath => {
  fs.unlink( filePath, err => console.log( err ))
}

function ifNoPost() {
  const error = new Error( 'Could not find post.' )
  error.statusCode = 404
  throw error
}

function hasNoPermissions() {
  const error = new Error( 'Not the right permissions!' )
  error.statusCode = 403
  throw error
}

