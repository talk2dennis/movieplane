import mongoose, { Document, Schema } from 'mongoose';
import bycript from 'bcrypt';

export interface IUser extends Document {
    username: string;
    email: string;
    password_hash: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
    favorites_movies: string[];
    watchlist_movies: string[];
    followers?: string[];
    following?: string[];
    // Method to compare passwords
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    password_hash: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    profilePicture: {
        type: String,
        default: 'https://example.com/default-profile-picture.png'
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    favorites_movies: [{
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        default: []
    }],
    watchlist_movies: [{
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        default: []
    }]
}, {
    timestamps: true
});

// Pre-save hook to hash password
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password_hash')) {
        return next();
    }
    try {
        const salt = await bycript.genSalt(15);
        this.password_hash = await bycript.hash(this.password_hash, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bycript.compare(candidatePassword, this.password_hash);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Create the User model
const User = mongoose.model<IUser>('User', userSchema);
export default User;