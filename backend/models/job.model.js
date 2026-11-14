import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: Number,
        required: true,
        min: 0.01
    },
    experienceLevel:{
        type:Number,
        required:true,
        min:0
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength:100
    },
    jobType: {
        type: String,
        required: true,
        trim: true,
        maxlength:60
    },
    position: {
        type: Number,
        required: true,
        min:1,
        validate: Number.isInteger
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
},{timestamps:true});
export const Job = mongoose.model("Job", jobSchema);