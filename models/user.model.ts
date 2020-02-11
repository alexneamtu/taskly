// npm
import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);
