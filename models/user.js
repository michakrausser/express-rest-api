import mongoose from "mongoose"


const Schema = mongoose.Schema
export default mongoose.model( 'User', new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "I'm new"
    },
    posts: [
      {
        type: String,
        required: true
      }
    ]
  }
))
