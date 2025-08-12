const {querySchema, watchReviewSchema,testimonialSchema,signInSchema}=require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');
 
const validateReview=async(req,res,next)=>{
    let {error}=querySchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',')
        next(new ExpressError(errMsg,404));
    }
    else{
        next();
    }
}

const validateTestimonial=(req,res,next)=>{
    let{error}= testimonialSchema.validate(req.body);
    if(error){
        next(new ExpressError(error.message,404));
    }
    else{
        next();
    }
}

const validateWatchReview=(req,res,next)=>{
    let{error}= watchReviewSchema.validate(req.body);
    if(error){
        next(new ExpressError(error.message,404));
    }
    else{
        next();
    }
}

const validateUser=(req,res,next)=>{
    let {error}= signInSchema.validate(req.body);
    if(error){
        next(new ExpressError(error.message,502));
    }
    else{
        next();
    }
}


const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("success","You are not logged In!");
        res.redirect('/')
    }
    else{
        next();
    }
}




module.exports={validateReview,validateTestimonial,validateWatchReview,validateUser,isLoggedIn}