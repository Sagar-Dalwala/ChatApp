import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

const signup = asyncHandler(async (req, res) => {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (
        [fullName, username, password, confirmPassword, gender].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if (password != confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    const existedUser = await User.findOne({ username });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
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

    return res
        .status(201)
        .json(new ApiResponse(201, createduser, "User created successfully."));
});

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!(username || password)) {
        throw new ApiError(400, "Username and password are required");
    }

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Incorrect password");
    }

    generateTokenAndSetCookie(user._id, res);

    const loggedInUser = await User.findById(user._id).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, loggedInUser, "User logged in successfully")
        );
});

const logout = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { signup, login, logout };
