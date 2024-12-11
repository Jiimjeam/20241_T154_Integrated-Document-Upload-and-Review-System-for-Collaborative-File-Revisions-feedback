import mongoose from 'mongoose';

const collegeDepartments = {
  COB: ['Business Administration', 'Accounting', 'Marketing'],
  COT: [' BSIT', 'BSAT', 'BSET'],
  CON: ['Nursing', 'Midwifery'],
  COE: ['Civil Engineering', 'Electrical Engineering'],
  CAS: ['Biology', 'Mathematics', 'Physics'],
  CPAG: ['Public Administration', 'Governance'],
  COM: ['Medicine', 'Medical Technology']
};

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Only require password if googleId is not provided
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows for either googleId or email to be unique
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
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  
  // College field to select from available colleges
  college: {
    type: String,
    enum: Object.keys(collegeDepartments), // Restricts to the keys in collegeDepartments
    required: false // College is optional, as the department field is dependent on it
  },
  
  // Department field validated based on the selected college
  department: {
    type: String,
    validate: {
      // Validation checks if department is valid for the selected college
      validator: function (value) {
        const normalizedValue = value.toLowerCase(); // Normalize the department name for comparison
        const departments = collegeDepartments[this.college]?.map(dep => dep.toLowerCase()); // List of valid departments for the selected college
        return departments?.includes(normalizedValue); // Return true if department is valid
      },
      message: props => `The department "${props.value}" is not valid for the selected college "${this.college}". Please select a valid department.`
    },
    required: function () {
      return !!this.college; // Make department required only if college is selected
    }
  },

  // User's role in the system
  role: {
    type: String,
    enum: ['Instructor', 'Senior_Faculty', 'Program_Chair', 'CITL', 'Admin'],
    default: 'Instructor', // Default role for new users
    required: true
  }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Export the User model based on the schema
export const User = mongoose.model('User', userSchema);
