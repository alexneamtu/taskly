// npm
import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';


export interface ITask extends Document {
  title: string;
  description: string;
  deadline: Date;
  reminder: Date;
  completed: boolean;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  deadline: { type: Date, required: false },
  reminder: { type: Date, required: false },
  completed: { type: Boolean, default: false },
});

// Export the model and return your ITask interface
export default mongoose.model<ITask>('Task', TaskSchema);
