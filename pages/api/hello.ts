import { connectToDatabase } from './_connector';

export default async (req, res) => {
  await connectToDatabase();

  res.status(200).json({ name: 'Sarvarbek' });
};
