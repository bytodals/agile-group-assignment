import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  genre?: string;
  author: mongoose.Types.ObjectId;
  olKey?: string;
  coverId?: number;
  available: boolean;
  favorite: boolean;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    olKey: { type: String, trim: true },
    coverId: { type: Number },
    available: { type: Boolean, default: true },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true },
);

BookSchema.index({ title: 'text' });

export default mongoose.model<IBook>('Book', BookSchema);
