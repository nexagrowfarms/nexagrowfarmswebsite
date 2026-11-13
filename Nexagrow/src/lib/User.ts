import mongoose from 'mongoose';

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password?: string; // hashed; only for credentials provider
  name?: string | null;
  image?: string | null;
  provider: 'credentials' | 'google' | 'yahoo';
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.provider === 'credentials';
      },
    },
    name: { type: String, default: null },
    image: { type: String, default: null },
    provider: {
      type: String,
      enum: ['credentials', 'google', 'yahoo'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
