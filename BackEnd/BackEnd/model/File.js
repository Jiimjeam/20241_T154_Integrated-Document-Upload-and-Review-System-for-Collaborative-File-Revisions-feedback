import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  subjectCode: { type: String, required: true },
  author: { type: String, required: true },
  coAuthor: { type: String, default: '' },
  recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Recipient user ID
  uploaderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Uploader user ID
  status: { type: String, enum: ['pending', 'approved', 'revision'], default: 'pending' }, // File status
  revisionComments: [
    {
      comment: { type: String, required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  college: { type: String, required: true }, // College of the uploader
  department: { type: String, required: true }, // Department of the uploader
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('File', fileSchema);
