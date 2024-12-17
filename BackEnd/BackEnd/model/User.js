import mongoose from 'mongoose';

const collegeDepartments = {
  COB: ['Business Administration', 'Accounting', 'Marketing'],
  COT: ['BSIT', 'BSAT', 'BSET'],
  CON: ['Nursing', 'Midwifery'],
  COE: ['Civil Engineering', 'Electrical Engineering'],
  CAS: ['Biology', 'Mathematics', 'Physics'],
  CPAG: ['Public Administration', 'Governance'],
  COM: ['Medicine', 'Medical Technology']
};

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () { return !this.googleId; }
  },
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  lastLogin: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  college: { type: String, enum: Object.keys(collegeDepartments), required: false },
  department: {
    type: String,
    validate: {
      validator: function (value) {
        const normalizedValue = value.toLowerCase();
        const departments = collegeDepartments[this.college]?.map(dep => dep.toLowerCase());
        return departments?.includes(normalizedValue);
      },
      message: props => `The department "${props.value}" is not valid for the selected college "${this.college}".`
    },
    required: function () { return !!this.college; }
  },
  role: { type: String, enum: ['Instructor', 'Senior_Faculty', 'Program_Chair', 'CITL', 'Admin', 'Editor'], default: 'Instructor', required: true },
  lock: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lockedAt: { type: Date, default: Date.now }
  },
  editorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function (value) {
        if (value) {
          const editor = await this.model('User').findById(value);
          return editor && editor.role === 'Editor'; // Ensure the editorId points to a user with the 'Editor' role
        }
        return true; // Allow empty editorId if not set
      },
      message: 'The provided editorId must be a valid user with the "Editor" role.'
    }
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
