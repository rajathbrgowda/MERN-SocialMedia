import brcypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* Register a new user */
export const register = async (req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        const salt = await brcypt.genSalt(10);
        const passwordHash = await brcypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewdprofile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } 
    catch (err){
        res.status(500).json({error: err.message});
    }
};

/* Login an existing user */
export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await brcypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ result: user, token });
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
};