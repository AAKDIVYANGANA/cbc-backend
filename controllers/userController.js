import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function saveUser(req, res) {

if(req.body.role == "admin") {
    if(req.user==null){
    res.status(403).json({
        message: "Please login as admin before creating an admin account",
    }); 
    return;
}
if(req.user.role !="admin"){
    res.status(403).json({
        message: "You are not authorized to create an admin account",
    });
    return;
}   
}

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        email: req.body.email,
        firstname: req.body.firstName, 
        lastname: req.body.lastName,   
        password: hashedPassword,
        role: req.body.role,
    });

    user.save()
        .then(() => {
            res.json({
                message: "User saved successfully"
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                message: "User not saved",
                error: error.message
            });
        });
}
export function loginUser(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    }).then((user) => {
            if(user == null) {
                res.json({
                    message: "Invalid email"
                })
            } else {
                const isPasswordCorrect = bcrypt.compareSync(password, user.password)
                if(isPasswordCorrect) {
                    
                    const userData = {
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        role: user.role,
                        phone: user.phone,
                        isDissabled: user.isDissabled,
                        isEmailVerified: user.isEmailVerified
                    }

                    console.log(userData)

                    const token = jwt.sign(userData,process.env.JWT_KEY)

                    res.json({
                        message: "Login successful",
                        token: token
                    });

                } else {
                    res.json({
                        message: "Invalid password"
                    })
                }
    }
})
}