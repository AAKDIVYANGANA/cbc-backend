import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: "Not given"
    },
    isDissabled: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
});

const User = mongoose.model("User", userSchema);
export default User;