import mongoose, { Schema, Document, Model } from 'mongoose';

export type Operator = 'GP' | 'Robi' | 'Banglalink' | 'Airtel' | 'Teletalk';
export type ProductStatus = 'active' | 'inactive' | 'pending';

export interface IProduct extends Document {
  name: string;
  description?: string;
  category: string;
  operator: Operator;
  packageSize?: string;
  validity?: string;
  image?: string;
  status: ProductStatus;
  createdBy: mongoose.Types.ObjectId;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    operator: {
      type: String,
      enum: ['GP', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'],
      required: true,
    },
    packageSize: {
      type: String,
    },
    validity: {
      type: String,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProductSchema.index({ operator: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ isApproved: 1 });
ProductSchema.index({ createdBy: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

