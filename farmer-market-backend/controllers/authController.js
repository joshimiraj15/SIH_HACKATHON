const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, location, role } = req.body;

        if (!name || !email || !password || !phone || !location || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, email, password, phone, location, role) are required',
                error: 'Bad Request'
            });
        }

        if (role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin accounts cannot be registered publicly',
                error: 'Forbidden'
            });
        }

        const userExists = await User.findOne({
            $or: [{ email }, { phone }]
        });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or mobile number',
                error: 'Duplicate Record'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            location,
            role
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
                token: generateToken(user._id, user.role)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email/mobile and password',
                error: 'Bad Request'
            });
        }

        const cleanLogin = email.trim();
        const user = await User.findOne({
            $or: [
                { email: cleanLogin.toLowerCase() },
                { phone: cleanLogin },
                { email: `${cleanLogin}@kishansetu.in` }
            ]
        }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    location: user.location,
                    token: generateToken(user._id, user.role)
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email/mobile or password',
                error: 'Unauthorized'
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: user
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found',
                error: 'Not Found'
            });
        }
    } catch (error) {
        next(error);
    }
};
