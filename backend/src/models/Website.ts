import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsite extends Document {
  name: string;
  domain: string;
  status: 'active' | 'inactive';
  contentCount: number;
  lastUpdated: Date;
  apiUsage: number;
  owner: mongoose.Types.ObjectId;
  teamMembers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteSchema: Schema = new Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  contentCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  apiUsage: { type: Number, default: 0 },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teamMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true
});

export default mongoose.model<IWebsite>('Website', WebsiteSchema); 