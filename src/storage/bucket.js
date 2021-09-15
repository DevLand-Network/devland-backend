import { Storage } from '@google-cloud/storage';
// import fs from "fs";
// import { promisify } from "util";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(dirname(import.meta.url));

// const readFile = promisify(fs.readFile);

const storage = new Storage({
  keyFilename: resolve(__dirname, './serviceAccountKey.json'),
});

// Get main bucket

const bucket = storage.bucket('devland-staging');

export const putFile = async (fileContent, filename) => {
  const file = bucket.file(filename);
  await file.save(fileContent);
  // make public
  await file.makePublic();
  return file;
};

export const deleteFile = async (filename) => {
  const file = bucket.file(filename);
  await file.delete();
};

export const getFile = async (filename) => {
  const file = bucket.file(filename);
  return await file.download();
};

export const createUploadStream = async (buffer, filename, mimetype) => {
  const file = bucket.file(filename);
  const stream = file.createWriteStream({
    metadata: {
      contentType: mimetype,
    },
    resumable: false,
  });
  return new Promise((resolve, reject) => {
    stream.on('error', (err) => {
      reject(err);
    });
    stream.on('finish', async () => {
      await file.makePublic();
      resolve(file);
    });
    stream.end(buffer);
  });
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
