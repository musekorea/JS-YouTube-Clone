import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Video' },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
