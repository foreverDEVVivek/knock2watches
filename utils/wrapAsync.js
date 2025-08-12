const ExpressError=require("./ExpressError.js")

function wrapAsync(fun){
 return function(req,res,next){
    fun(req,res,next).catch((err)=>{
        next(new ExpressError("Validation Error",502))
    })
 }
}

module.exports=wrapAsync;
