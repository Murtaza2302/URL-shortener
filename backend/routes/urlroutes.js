import express from 'express';
import shortid from 'shortid';
import Url from '../models/url.js';

const router = express.Router();

// POST /api/shorten
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    let url = await Url.findOne({ longUrl });
    if (url) return res.json({ shortCode: url.shortCode });

    const shortCode = shortid.generate();
    url = new Url({ longUrl, shortCode });
    await url.save();
    res.json({ shortCode });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:shortcode
router.get('/:shortcode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortcode });
    if (url) {
      url.visitCount++;
      await url.save();
      return res.redirect(url.longUrl);
    }
    res.status(404).json({ error: 'Not found' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
