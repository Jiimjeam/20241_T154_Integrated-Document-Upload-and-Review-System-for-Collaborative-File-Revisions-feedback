import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User receiving the notification
  title: { type: String, required: true }, // Notification title
  message: { type: String, required: true }, // Notification message
  isRead: { type: Boolean, default: false }, // Whether the notification has been read
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

export const Notification = mongoose.model('Notification', notificationSchema);
