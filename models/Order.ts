import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderStatus = 'pending' | 'assigned' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'wallet' | 'sslcommerz' | 'bkash';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrder extends Document {
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  sellerProductId: mongoose.Types.ObjectId;
  operator: string;
  mobileNumber: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  commission: number;
  sellerAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  assignedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: 'customer' | 'seller' | 'admin';
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    sellerProductId: {
      type: Schema.Types.ObjectId,
      ref: 'SellerProduct',
      required: true,
    },
    operator: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    commission: {
      type: Number,
      required: true,
      min: 0,
    },
    sellerAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'processing', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['wallet', 'sslcommerz', 'bkash'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentTransactionId: {
      type: String,
    },
    assignedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancelledBy: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (orderNumber already has unique: true, so no need to index again)
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ sellerId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Order Number Generate করার Middleware
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

