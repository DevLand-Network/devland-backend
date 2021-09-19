import { createUploadStream, deleteFile } from '../storage/bucket.js';
import { Router } from 'express';
import Busboy from 'busboy';
import commonErrors from '../messages/error/http.js';
import axios from 'axios';
import { protectedByOwnership } from '../security/ownership.js';
import { secureEndpoint } from '../security/token.js';
import { isMimeTypeAllowed } from '../security/contentRules.js';

const router = Router();

const { badRequest, notFound, internalServerError } = commonErrors;

// @route   POST api/media/
// To test without authentication: Remove secureEndpoint

router.post('/:shortID', secureEndpoint, protectedByOwnership, async (req, res) => {
  const busboy = new Busboy({
    headers: req.headers,
    limits: { fileSize: 10 * 1024 * 1024 },
  });
  const { shortID: targetUser } = req.params;
  let fileUploaded;
  busboy.on('file', async (filedName, file, filename, encoding, mimeType) => {
    // Check if mimeType is allowed
    if (!isMimeTypeAllowed(mimeType)) {
      return res.status(400).json(badRequest('File type not allowed'));
    }
    const uniqueFilename = `${Date.now()}-${filename}`;
    const fullPathName = `${targetUser}/${uniqueFilename}`;
    // Try to upload file
    try {
      const stream = createUploadStream({ file, fullPathName, mimeType });
      fileUploaded = stream;
    } catch (err) {
      res.status(500).json(internalServerError(err));
    }
  });
  // After uploading file is done
  busboy.on('finish', () => {
    if (fileUploaded) {
      const bucketUrl = `https://storage.googleapis.com/${fileUploaded.bucket.id}/${fileUploaded.name}`;
      const apiEndpoint = `/api/media/${fileUploaded.name}`;
      return res.json({
        bucketUrl,
        apiEndpoint,
      });
    } else {
      return res.status(400).send(badRequest('No file uploaded'));
    }
  });
  req.pipe(busboy);
});

// @route   Delete api/media/:shortID/:filename

router.delete('/:shortID/:filename', secureEndpoint, protectedByOwnership, async (req, res) => {
  const { shortID: targetUser, filename } = req.params;
  const fullPathName = `${targetUser}/${filename}`;
  try {
    await deleteFile(fullPathName);
    return res.json({
      message: 'File deleted',
    });
  } catch (err) {
    return res.status(404).json(notFound(err.message));
  }
});

// @route   GET api/media/:shortID/:filepath

router.use('/:shortID', async (req, res) => {
  const { path } = req;
  const { shortID: targetUser } = req.params;
  const bucketUrl = `https://media.devland.workers.dev/${targetUser}${path}`;
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
