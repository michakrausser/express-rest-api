import mongoose from "mongoose"


const Schema = mongoose.Schema
export default mongoose.model( 'Post', new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
))
