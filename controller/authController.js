const User = require('../models/User')//usewr model
const jwt =require('jsonwebtoken');

//handleing err
const handleErrors = (err)=>{
    console.log(err.message,err.code);
    //unique
    let errors = {
        email:'',
        password:''
    }

    if(err.message==='incorrect email'){
        errors.email= 'email you entered not regitered...';
    }

    if(err.message==='incorrect password'){
        errors.password= 'password you entered incorrect...';
    }


    if(err.code==11000){
        errors.email='Email already registered !!'
        return errors;
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            // console.log(properties);
            errors[properties.path]=properties.message;
        })
    }
    return errors;
}

//create JsonWebToken

const maxAge= 3 * 24 * 60 * 60;
const createToken =(id)=>{
    return jwt.sign({id},'netninjatuto',{
        expiresIn:maxAge
    });

}

module.exports.login_get=(req,res)=>{
    res.render('login');
}

module.exports.signup_get=(req,res)=>{
    res.render('signup');
}

module.exports.signup_post= async (req,res)=>{
    const {email,password}=req.body;
    try {
        //saving
        const user = await User.create({email,password});
        //create token
        const token = createToken(user._id);

        //create cookie
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge * 1000});

        //response
        res.status(201).json({user:user._id});

    } catch (error) {

        const err = handleErrors(error);
        // console.log(error);
        res.status(400).json({err});
    }


}

module.exports.login_post= async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await User.login(email,password);
        //create token
        const token = createToken(user._id);
        //create cookie
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge * 1000});


        res.status(201).json({user:user._id});

    } catch (error) {

        const errors = handleErrors(error);
        res.status(400).json({errors});
    }

    
 }


 module.exports.logout_get =(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');

    
}

 