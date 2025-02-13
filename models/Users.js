import mongoose from "../lib/mongodb";

const UserSchema = new mongoose.Schema(
    {
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ''
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        address: {
            country: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            postal_code: {
                type: String,
                required: true
            },
            line2: {
                type: String,
                default: ''
            },
            city: {
                type: String,
                required: true
            },
            line1: {
                type: String,
                required: true
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
        },
        fullName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            match: [/^\d{10,15}$/, 'Invalid phone number format']
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true // Automatically creates createdAt and updatedAt fields
    }
);


const Users = mongoose.models.Users || mongoose.model('Users', UserSchema, "Users");
export default Users;
