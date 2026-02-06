import jwt from "jsonwebtoken";
export default function verifyJWT (req,res,next){
        const header=req.get("Authorization");
        if(header != null){
            const token=header.replace("Bearer ","");
            jwt.verify(token,"random456",(error,decoded)=>{
                console.log(decoded)
                if(decoded != null){
                    req.user = decoded
                }
                next();
        });
    } else {
        next(); 
    }
}