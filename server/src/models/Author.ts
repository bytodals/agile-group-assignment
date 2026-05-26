import mongoose, { Document, Schema } from 'mongoose';
import type { Author } from '@shared/author.js';

export interface IAuthor extends Author, Document {}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true, trim: true },
    olKey: { type: String, trim: true },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<IAuthor>('Author', AuthorSchema);
