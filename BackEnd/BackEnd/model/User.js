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
        enum: ['COB', 'COT', 'CON', 'COE', 'CAS', 'CPAG', 'COM'],
        required: true
    },
    department: {
        type: String,
        validate: {
          validator: function(value) {
            // Normalize the department and college to lowercase for case-insensitive comparison
            const normalizedValue = value.toLowerCase();
            const collegeDepartments = {
              COB: ['Business Administration', 'Accounting', 'Marketing'],
              COT: ['BSIT', 'BSAT', 'BSET'],
              CON: ['Nursing', 'Midwifery'],
              COE: ['Civil Engineering', 'Electrical Engineering'],
              CAS: ['Biology', 'Mathematics', 'Physics'],
              CPAG: ['Public Administration', 'Governance'],
              COM: ['Medicine', 'Medical Technology']
            };
      
            const departments = collegeDepartments[this.college]?.map(dep => dep.toLowerCase());
      
            // Ensure department matches one in the college's department list
            return departments?.includes(normalizedValue);
          },
          message: props => `${props.value} is not a valid department for the selected college`
        },
        required: function() {
          return !!this.college;
        }
      }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
