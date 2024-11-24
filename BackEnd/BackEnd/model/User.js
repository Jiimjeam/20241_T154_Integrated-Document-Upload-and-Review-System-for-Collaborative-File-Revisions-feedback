import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    college: {
        type: String,
        enum: ['COT', 'CON', 'CAS'],
        default: 'COT'
    },
    department: {
        type: String,
        enum: [
            'Bachelor of Science in Information Technology & Bachelor of Science in EMC',
            'Bachelor of Science in Food Technology',
            null
        ],
        default: null
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
