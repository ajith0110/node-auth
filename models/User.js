const mongoose = require('mongoose');
const {isEmail} =require('validator');//custom validation pack
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please enter an email address...'],
        lowercase:true,
        unique:true,
        validate:[isEmail,'Please enter an valid email..']
    },
    password:{
        type:String,
        required:[true,'Please enter an password...'],
       
        minlength:[6,'Minimum password length is 6 character...']
    }

});

//fire after save
// userSchema.post('save', function  (doc,next){
//     console.log('data saved',doc)
//     next();

// })

//fire before save
userSchema.pre('save', async function(next){
    // console.log('user before save',this);
    const salt= await bcrypt.genSalt();//creating salt
    this.password = await bcrypt.hash(this.password,salt);//hashing password

    next();

});


//custom fuction for login
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
            const auth = await bcrypt.compare(password,user.password);
            if(auth){
                return user;
            }throw Error('incorrect password');
    }throw Error('incorrect email');
};




module.exports = User= mongoose.model('user',userSchema)
