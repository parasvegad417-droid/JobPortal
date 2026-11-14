import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:100,
        unique:true
    },
    description:{
        type:String, 
        maxlength:1000
    },
    website:{
        type:String,
        maxlength:2048,
        validate: {
            validator: value => !value || /^https?:\/\/\S+$/i.test(value),
            message: "Website must be a valid HTTP(S) URL."
        }
    },
    location:{
        type:String,
        maxlength:100
    },
    logo:{
        type:String // URL to company logo
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})
export const Company = mongoose.model("Company", companySchema);