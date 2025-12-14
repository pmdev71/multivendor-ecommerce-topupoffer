import mongoose, { Schema, Document, Model } from 'mongoose';

export type TransactionType = 'deposit' | 'withdrawal' | 'order_payment' | 'order_refund' | 'commission' | 'payout';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface ITransaction extends Document {
  transactionNumber: string;
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  paymentMethod?: string;
  paymentTransactionId?: string;
  orderId?: mongoose.Types.ObjectId;
  withdrawalId?: mongoose.Types.ObjectId;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    transactionNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'order_payment', 'order_refund', 'commission', 'payout'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
    },
    paymentTransactionId: {
      type: String,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    withdrawalId: {
      type: Schema.Types.ObjectId,
      ref: 'Withdrawal',
    },
    description: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (transactionNumber already has unique: true, so no need to index again)
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });

// Transaction Number Generate করার Middleware
TransactionSchema.pre('save', async function (next) {
  if (!this.transactionNumber) {
    const count = await mongoose.model('Transaction').countDocuments();
    this.transactionNumber = `TXN-${Date.now()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;

