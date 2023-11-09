import { Stream } from 'stream';

export type BlobResponse = {
  blob: Blob;
  error: boolean;
  status: string;
};

export type Blob = {
  uri: string;
  name: string;
  contentType?: string | null;
  content?: Stream | null;
};
