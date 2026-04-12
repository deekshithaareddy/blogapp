import {Schema,model,Types} from 'mongoose'

// create comment Schema
const commentSchema=new Schema({
    user:{
        type:Types.ObjectId,
        ref:"user",
        required:[true,"User ID is required"]
    },
    comment:{
        type:String,
        required:[true,"Enter comment"]
    }
},{
    versionKey:false,
    timestamps:true,
    strict:"throw"
})
const articleSchema=new Schema({
    author:{
        type:Types.ObjectId,
        ref:"user",
        required:[true,"Author ID is required"]
    },
    title:{
        type:String,
        required:[true,"Title is required"]
    },
    category:{
        type:String,
        required:[true,"Title is required"]
    },
    content:{
        type:String,
        required:[true,"Content is required"]
    },
    comments:[commentSchema],
    isArticleActive:{
        type:Boolean,
        default:true
    }
},{
    versionKey:false,
    timestamps:true,
    strict:"throw"
})

export const articlemodel=model("article",articleSchema)

