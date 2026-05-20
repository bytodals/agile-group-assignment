import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  genre?: string;
  author: mongoose.Types.ObjectId;
  available: boolean;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

BookSchema.index({ title: 'text' });

export default mongoose.model<IBook>('Book', BookSchema);
