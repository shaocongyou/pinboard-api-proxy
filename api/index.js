import { createProxyMiddleware } from 'http-proxy-middleware';
import NextCors from 'nextjs-cors';

const apiProxy = createProxyMiddleware({
  target: (req) => {
    if (req.url.startsWith('/https/')) {
      const host = req.url.slice(7).split('/')[0];
      return `https://${host}`;
    } else if (req.url.startsWith('/http/')) {
      const host = req.url.slice(6).split('/')[0];
      return `http://${host}`;
    } else {
      return null;
    }
  },
  changeOrigin: true,
  proxyReqPathResolver: (req) => {
    if (req.url.startsWith('/https/')) {
      const parts = req.url.slice(7).split('/');
      return '/' + parts.slice(1).join('/');
    } else if (req.url.startsWith('/http/')) {
      const parts = req.url.slice(6).split('/');
      return '/' + parts.slice(1).join('/');
    } else {
      return req.url;
    }
  },
  onProxyRes(proxyRes, req, res) {
    proxyRes.headers['access-control-allow-origin'] = '*';
    proxyRes.headers['access-control-allow-methods'] = 'DELETE, POST, GET, OPTIONS, PUT, PATCH';
    proxyRes.headers['access-control-allow-headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
  },
});

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  return apiProxy(req, res);
}