import { connectToDatabase } from './_connector';

export default async (req, res) => {
  const db = await connectToDatabase();

  // If link is provided , system will create a new link in db
  if (req.body !== '' && req.body.link !== undefined && req.body.link !== '') {
    const entry = await db
      .db('links_db')
      .collection('links_collection')
      .insertOne({ link: req.body.link });

    res.statusCode = 201;
    return res.json({
      short_link: `${process.env.VERCEL_URL}/r/${entry.insertedId}`,
    });
  }

  res.statusCode = 409; // Conflict
  res.json({ error: 'no_link_found', error_desc: 'No link found' });
};
