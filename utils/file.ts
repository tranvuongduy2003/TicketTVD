import { fileApi } from '@/apis';
import imageCompression, { Options } from 'browser-image-compression';

const defaultOptions = {
  maxSizeMB: 1
};

export function compressFile(
  imageFile: File,
  options: Options = defaultOptions
) {
  return imageCompression(imageFile, options);
}

export function getFile(uri: string) {
  const fileName = getFileName(uri);
  return fileApi.downloadFile(fileName);
}

export function getFileName(uri: string) {
  const decodedCoverImageUri = decodeURI(uri);
  const imageName = decodedCoverImageUri.split(
    'https://tickettvdblobstorage.blob.core.windows.net/files/'
  )[1];
  return imageName;
}
