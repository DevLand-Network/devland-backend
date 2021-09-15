import { createUploadStream } from '../storage/bucket.js';
import { Router } from 'express';
import Multer from 'multer';
import commonErrors from '../messages/error/http.js';
import axios from 'axios';

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const router = Router();

const { badRequest, notFound, internalServerError } = commonErrors;

// @route   POST api/media/

router.post('/:targetUser', multer.single('file'), async (req, res) => {
  const { file } = req;
  const { targetUser } = req.params;
  if (!file) return res.status(400).json(badRequest('No file was provided'));
  const { originalname, mimetype, size, buffer } = file;
  const fileName = `${targetUser}/${Date.now()}-${originalname}`;
  try {
    const success = await createUploadStream(buffer, fileName, mimetype);
    const bucketUrl = `https://storage.googleapis.com/${success.metadata.bucket}/${success.name}`;
    const publicUrl = `${req.protocol}://${req.get('host')}/media/${success.name}`;
    res.json({
      success: true,
      bucketUrl,
      publicUrl,
    });
  } catch (error) {
    return res.status(500).json(internalServerError('Error uploading file'));
  }
});

router.use('/:targetUser', async (req, res) => {
  const { path } = req;
  const { targetUser } = req.params;
  const bucketUrl = `https://media.devland.workers.dev/${targetUser}${path}`;
  console.log(bucketUrl);
  try {
    const response = await axios.get(bucketUrl, {
      Headers: req.headers,
      responseType: 'stream',
    });
    res.header(response.headers);
    response.data.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(404).json(notFound('File not found'));
  }
});
export default router;
