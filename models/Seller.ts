import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;
  storeName: string;
  isApproved: boolean;
  isOnline: boolean;
  totalEarnings: number;
  availableBalance: number;
  pendingWithdrawals: number;
  rating: number;
  totalOrders: number;
  completedOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingWithdrawals: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    completedOrders: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SellerSchema.index({ userId: 1 });
SellerSchema.index({ isApproved: 1 });
SellerSchema.index({ isOnline: 1 });

const Seller: Model<ISeller> = mongoose.models.Seller || mongoose.model<ISeller>('Seller', SellerSchema);

export default Seller;

