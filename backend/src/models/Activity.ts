import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  type: 'content_update' | 'content_create' | 'team_update' | 'api_usage';
  description: string;
  user: mongoose.Types.ObjectId;
  website: mongoose.Types.ObjectId;
  metadata: any;
  createdAt: Date;
}

const ActivitySchema: Schema = new Schema({
  type: { 
    type: String, 
    enum: ['content_update', 'content_create', 'team_update', 'api_usage'],
    required: true 
  },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  website: { type: Schema.Types.ObjectId, ref: 'Website', required: true },
  metadata: { type: Schema.Types.Mixed },
}, {
  timestamps: true
});

export default mongoose.model<IActivity>('Activity', ActivitySchema); 