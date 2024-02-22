import { Stream } from 'stream';

export interface BlobResponse {
  blob: Blob;
  error: boolean;
  status: string;
}

export interface Blob {
  uri: string;
  name: string;
  contentType?: string | null;
  content?: Stream | null;
}
