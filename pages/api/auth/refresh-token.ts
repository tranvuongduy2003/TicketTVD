import Cookies from 'cookies';
import httpProxy, { ProxyResCallback } from 'http-proxy';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export const config = {
  api: {
    bodyParser: false
  }
};

const proxy = httpProxy.createProxyServer();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(404).json({ message: 'method not supported' });
  }

  return new Promise(resolve => {
    req.headers.cookie = '';

    const handleRefreshTokenResponse: ProxyResCallback = proxyRes => {
      let body = '';

      proxyRes.on('data', function (chunk) {
        body += chunk;
      });

      proxyRes.on('end', function () {
        try {
          const { accessToken } = JSON.parse(body);

          const cookies = new Cookies(req, res, {
            secure: process.env.NODE_ENV !== 'development'
          });

          cookies.set('access_token', accessToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(accessToken.expiredAt)
          });

          (res as NextApiResponse)
            .status(200)
            .json({ message: 'refresh token successfully' });
        } catch (error) {
          (res as NextApiResponse)
            .status(500)
            .json({ message: 'something went wrong' });
        }

        resolve(true);
      });
    };

    proxy.once('proxyRes', handleRefreshTokenResponse);
    proxy.web(req, res, {
      target: process.env.API_URL,
      changeOrigin: true,
      selfHandleResponse: true
    });
  });
}
