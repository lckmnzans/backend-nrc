const mongoose = require('mongoose');
const schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = User = mongoose.model("user", UserSchema);