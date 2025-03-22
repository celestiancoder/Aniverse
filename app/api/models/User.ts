import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    Name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,select:false},
    role:{type:String,default:'user'},
    image:{type:String},
    authProviderId:{type:String},
    bookmarks: [
        {
          itemId: { type: String, required: true },
          itemType: { type: String, required: true },
        },
      ],
      name:{type:String}
})

export const User=mongoose.models?.User || mongoose.model("User",userSchema) 