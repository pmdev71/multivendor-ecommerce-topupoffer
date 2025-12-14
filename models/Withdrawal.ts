import mongoose, { Schema, Document, Model } from 'mongoose';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type WithdrawalMethod = 'bkash' | 'nagad' | 'rocket' | 'bank';

export interface IWithdrawal extends Document {
  withdrawalNumber: string;
  sellerId: mongoose.Types.ObjectId;
  amount: number;
  method: WithdrawalMethod;
  accountNumber: string;
  accountName?: string;
  status: WithdrawalStatus;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  transactionId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema: Schema = new Schema(
  {
    withdrawalNumber: {
      type: String,
      required: true,
      unique: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ['bkash', 'nagad', 'rocket', 'bank'],
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
WithdrawalSchema.index({ withdrawalNumber: 1 });
WithdrawalSchema.index({ sellerId: 1 });
WithdrawalSchema.index({ status: 1 });
WithdrawalSchema.index({ createdAt: -1 });

// Withdrawal Number Generate করার Middleware
WithdrawalSchema.pre('save', async function (next) {
  if (!this.withdrawalNumber) {
    const count = await mongoose.model('Withdrawal').countDocuments();
    this.withdrawalNumber = `WD-${Date.now()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Withdrawal: Model<IWithdrawal> =
  mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);

export default Withdrawal;

