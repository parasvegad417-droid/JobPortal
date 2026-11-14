import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{10}$/
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        linkedinUrl:{type:String, trim:true, maxlength:2048},
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
},{timestamps:true});
export const User = mongoose.model('User', userSchema);