import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRouter.js';

let app = express();

//mongodb+srv://admin:123@cluster0.cr6voab.mongodb.net/?appName=Cluster0
mongoose.connect("mongodb+srv://admin:123@cluster0.cr6voab.mongodb.net/?appName=Cluster0").then(
    ()=>{
        console.log("Connected to the database");
    }
).catch(
    ()=>{
    console.log("Connection failed");
    }
)

app.use(bodyParser.json());
app.use(verifyJWT)
    


app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

app.get("/",
    (req,res)=>{
        console.log(req.body)
        console.log("Get request received");
        res.json({
            message : "Hello World"
        });
    }
)

app.post("/",
    (req,res)=>{
        console.log(req.body)
        console.log("Post request received");
        res.json({
            message : "This is a post request"
        });
    }
)

app.delete("/",
    (req,res)=>{
        console.log(req.body)
        console.log("Delete request received");
        res.json({
            message : "This is a delete request"
        });
    }
)

app.put("/",
    (req,res)=>{
        console.log(req.body)
        console.log("Put request received");
        res.json({
            message : "This is a put request"
        });
    }
)

app.listen(3000,
    ()=>{
    console.log("Server is running on port 3000");
}
)