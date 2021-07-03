import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  socialOnly: { type: Boolean, default: false },
});

userSchema.pre('save', async function () {
  console.log('User Password=', this);
  this.password = await bcrypt.hash(this.password, 5);
  console.log('Hashed Password=', this);
});

const User = mongoose.model('User', userSchema);
export default User;
