import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  user: mongoose.Types.ObjectId;
  level: number;
  points: number;
  contentCreation: number;
  teamCollaboration: number;
  apiUsage: number;
  achievements: string[];
  lastUpdated: Date;
}

const UserProgressSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  contentCreation: { type: Number, default: 0 },
  teamCollaboration: { type: Number, default: 0 },
  apiUsage: { type: Number, default: 0 },
  achievements: [{ type: String }],
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema); 