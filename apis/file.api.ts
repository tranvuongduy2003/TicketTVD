import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { Blob, BlobResponse } from '@/models';

export const fileApi = {
  getListAllBlobs: () => {
    return httpRequest.get<Blob[]>(API_ROUTE.file, {
      baseURL: process.env.FILE_API_URL
    });
  },
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return httpRequest.post<BlobResponse>(API_ROUTE.file, formData, {
      baseURL: process.env.FILE_API_URL,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  downloadFile: (filename: string) => {
    return httpRequest.get(`${API_ROUTE.file}/filename`, {
      params: { filename },
      baseURL: process.env.FILE_API_URL
    });
  },
  deleteFile: (filename: string) => {
    return httpRequest.delete<BlobResponse>(`${API_ROUTE.file}/filename`, {
      params: { filename },
      baseURL: process.env.FILE_API_URL
    });
  }
};
