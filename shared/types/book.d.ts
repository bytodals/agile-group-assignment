export interface Book {
  title: string;
  genre?: string;
  author: string; // serialized ObjectId string in API responses
  available: boolean;
}
