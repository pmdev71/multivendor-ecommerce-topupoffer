import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
  role: 'customer' | 'seller' | 'admin';
  googleId?: string;
  wallet: {
    balance: number;
    transactions: mongoose.Types.ObjectId[];
  };
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
        min: 0,
      },
      transactions: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Transaction',
        },
      ],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (email and googleId already have unique: true, so no need to index again)
UserSchema.index({ role: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

