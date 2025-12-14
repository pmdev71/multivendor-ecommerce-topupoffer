import mongoose, { Schema, Document, Model } from 'mongoose';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface IOffer extends Document {
  offerNumber: string;
  needId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  price: number;
  status: OfferStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema: Schema = new Schema(
  {
    offerNumber: {
      type: String,
      required: true,
      unique: true,
    },
    needId: {
      type: Schema.Types.ObjectId,
      ref: 'Need',
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending',
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

// Indexes (offerNumber already has unique: true, so no need to index again)
OfferSchema.index({ needId: 1 });
OfferSchema.index({ sellerId: 1 });
OfferSchema.index({ status: 1 });
OfferSchema.index({ expiresAt: 1 });

// Offer Number Generate করার Middleware
OfferSchema.pre('save', async function (next) {
  if (!this.offerNumber) {
    const count = await mongoose.model('Offer').countDocuments();
    this.offerNumber = `OFFER-${Date.now()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

export default Offer;

