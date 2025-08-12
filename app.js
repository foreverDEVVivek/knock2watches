if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
} 
const express=require('express');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');
const flash=require('connect-flash');
const mongoose=require('mongoose');
const session=require('express-session')
const methodOverride=require("method-override");
const rootRouter=require('./routes/rootRouter.js');
const watchRouter=require('./routes/watchRouter.js');
const contactRouter=require('./routes/contactRouter.js');
const aboutRoute=require("./routes/aboutRouter.js");
const testimonialRouter=require("./routes/testimonialRouter.js");
const userRouter=require('./routes/userRouter.js');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const Cart=require('./models/cartSchema.js');
const User=require('./models/userSchema.js');
const{isLoggedIn}=require('./middleware.js');

const mongoUrl=process.env.MONGO_DB_URL;
async function connectDb() {
    return await mongoose.connect(mongoUrl);
}

connectDb().then(() => {
    console.log("Connected to DB Successfully ........")
}).catch((err) => {
    console.log(err)
});

//session options
const sessionOptions={
    secret:process.env.SESSION_SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        maxAge:1000 * 60 * 60,
    },
}

//ejs related stuff.
app.engine('ejs',ejsMate);
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

//set static folder
app.use(express.static(path.join(__dirname,'/public')))

//setting urlencoded data
app.use(express.urlencoded({extended:true}));

//method Override
app.use(methodOverride('_method'));

//setting up session
app.use(session(sessionOptions));

//setting up flash middleware
app.use(flash());

app.use(async (req, res, next) => {
    if (req.user) {
        const cart = await Cart.findOne({ user: req.user._id });
        res.locals.cartCount = cart
            ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
            : 0;
    } else {
        res.locals.cartCount = 0;
    }
    next();
});


//Passport JS related stuff...
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//setting up a middleware that stores flash message to res.locals object
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.user=req.user;
    next();
})

/* Here we are modularizing all routes with the help of middleware...*/

// Root Route...
app.use("/",rootRouter);

//Watch Route...
app.use('/watchs',watchRouter);

//contact Route...
app.use('/contact',contactRouter);

//about Route...
app.use('/about',aboutRoute);

//testimonial Route...
app.use('/testimonial',testimonialRouter);

//User Route...
app.use('/users',userRouter)

//Cart Route...
app.use('/cart',require('./routes/cartRouter.js'));

app.use('/checkout',require('./routes/checkoutRouter.js'));


//Error Handling Middleware
app.use((err,req,res,next)=>{
    let {message="Something Went Wrong!",status=550}=err;
    res.status(status).render("ejsFiles/error.ejs",{message,status})
});

//Running Server on Port No: 8080
app.listen(8080,()=>{
    console.log("Server Running Successfully...")
});