import { Storage } from '@google-cloud/storage';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(dirname(import.meta.url));

// const readFile = promisify(fs.readFile);

const storage = new Storage({
  keyFilename: resolve(__dirname, './serviceAccountKey.json'),
});

// Get main bucket

const bucket = storage.bucket('devland-staging');

// PUT bucket file

export const putFile = async (fileContent, filename) => {
  const file = bucket.file(filename);
  await file.save(fileContent);
  // make public
  await file.makePublic();
  return file;
};

// Get bucket file

export const deleteFile = async (filename) => {
  const file = bucket.file(filename);
  await file.delete();
};

// Get bucket file

export const getFile = async (filename) => {
  const file = bucket.file(filename);
  return await file.download();
};

// Create bucket file by stream

export const createUploadStream = ({ file: fileStream, fullPathName, mimeType }) => {
  const file = bucket.file(fullPathName);
  const stream = file.createWriteStream({
    metadata: {
      contentType: mimeType,
    },
    resumable: false,
  });
  stream.on('error', (err) => {
    console.log(err);
    throw err;
  });
  stream.on('finish', async () => {
    await file.makePublic();
  });
  fileStream.pipe(stream);
  return file;
};

// Create a function to test createUploadStream

// const test = async () => {
//   const buffer = await readFile(
//     resolve(__dirname, "../../public/favicon-32x32.png"),
//   );
//   const file = await createUploadStream(buffer, "test.png", "image/png");
//   const url = `https://storage.googleapis.com/${file.metadata.bucket}/${file.name}`
//   console.log(url);
// };

// test();
