import mongoose, { Schema, Document, Model } from 'mongoose';

export type NeedStatus = 'active' | 'accepted' | 'expired' | 'cancelled';

export interface INeed extends Document {
  needNumber: string;
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  operator: string;
  mobileNumber: string;
  quantity: number;
  status: NeedStatus;
  acceptedOfferId?: mongoose.Types.ObjectId;
  acceptedOrderId?: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NeedSchema: Schema = new Schema(
  {
    needNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
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
    status: {
      type: String,
      enum: ['active', 'accepted', 'expired', 'cancelled'],
      default: 'active',
    },
    acceptedOfferId: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
    },
    acceptedOrderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (needNumber already has unique: true, so no need to index again)
NeedSchema.index({ customerId: 1 });
NeedSchema.index({ status: 1 });
NeedSchema.index({ expiresAt: 1 });
NeedSchema.index({ createdAt: -1 });

// Need Number Generate করার Middleware
NeedSchema.pre('save', async function (next) {
  if (!this.needNumber) {
    const count = await mongoose.model('Need').countDocuments();
    this.needNumber = `NEED-${Date.now()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Need: Model<INeed> = mongoose.models.Need || mongoose.model<INeed>('Need', NeedSchema);

export default Need;

