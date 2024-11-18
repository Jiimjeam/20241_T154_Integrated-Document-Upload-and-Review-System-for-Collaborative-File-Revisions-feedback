import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  subjectCode: { type: String, required: true },
  author: { type: String, required: true },
  coAuthor: { type: String, default: '' },
  recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // New field for the recipient user
}, { timestamps: true });

export default mongoose.model('File', fileSchema);
