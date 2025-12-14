import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISellerProduct extends Document {
  sellerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  price: number;
  isActive: boolean;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SellerProductSchema: Schema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: এক Seller এক Product-এর জন্য একবারই Price Set করতে পারবে
SellerProductSchema.index({ sellerId: 1, productId: 1 }, { unique: true });
SellerProductSchema.index({ productId: 1, isActive: 1 });
SellerProductSchema.index({ price: 1 });

const SellerProduct: Model<ISellerProduct> =
  mongoose.models.SellerProduct || mongoose.model<ISellerProduct>('SellerProduct', SellerProductSchema);

export default SellerProduct;

