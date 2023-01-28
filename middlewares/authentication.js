const jwt =require("jsonwebtoken")

require("dotenv").config()

const authentication =(req,res,next) => 
{

    const token=req.headers?.authentication?.split(" ")[1]

    if(!token)
    {
        res.send("plece login")
    }

    const decoded=jwt.verify(token,process.env.SECRET_KEY);

    const user_id=decoded.user_id

    if(decoded)
    {
        req.body.user_id=user_id
        next()
    }
    else{
        res.send("place login")
    }
}

module.exports={
    authentication 
}







