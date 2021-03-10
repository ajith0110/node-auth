const express = require('express');
const mongoose = require('mongoose');
const router =require('./routes/authRoutes');
const cookieParser=require('cookie-parser');//cookies pack

const {requireAuth,checkUser} = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());

app.use(cookieParser());



// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://db:test123@cluster0.8kpop.mongodb.net/db?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*',checkUser);//apply to evry GET req
app.get('/', (req,res) => res.render('home'));
app.get('/smoothies',requireAuth,(req, res) => res.render('smoothies'));

app.use(router);

//cookies
// app.get('/setc',(req,res)=>{
//     // res.setHeader('Set-Cookie','newUser=true');
//     res.cookie('newUser',false);
//     res.cookie('isLoggedIn',true,{maxAge:1000*60*60*24,httpOnly:true});

//     res.send('got cookies');
// });

// app.get('/readc',(req,res)=>{
//   const cookies = req.cookies;
//   console.log(cookies.newUser);

//     res.json(cookies);

// });
