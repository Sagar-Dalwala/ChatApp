import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

const signup = asyncHandler(async (req, res) => {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (
        [fullName, gender, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    const existedUser = await User.findOne({ username });
    if (existedUser) {
        return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const user = await User.create({
        fullName,
        username,
        password: hashPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    generateTokenAndSetCookie(user._id, res);
    const createduser = await User.findById(user._id).select("-password");

    if (!createduser) {
        return res
            .status(500)
            .json({ error: "Something went wrong while registering user" });
    }

    return res.status(201).json({
        _id: createduser._id,
        fullName: createduser.fullName,
        username: createduser.username,
        profilePic: createduser.profilePic,
        gender: createduser.gender,
        message: "User created successfully",
    });
});

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!(username || password)) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(400).json({ error: "Incorrect password" });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
        message: "User logged in successfully",
    });
});

const logout = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out successfully" });
});

export { login, logout, signup };
