import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  videoURL: { type: String, required: true },
  thumbURL: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 2 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashTags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      //required: true,
      ref: 'Comment',
    },
  ],
});

videoSchema.static('formatHashTags', function (hashTags) {
  return hashTags
    .split(',')
    .map((word) => (word.startsWith('#') ? word : `#${word}`));
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
