import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// 只服务示例用到的四个文件；本地学习用途。
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/app.mjs', ['app.mjs', 'text/javascript; charset=utf-8']],
  ['/pricing.mjs', ['pricing.mjs', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
]);

export function createStaticServer(directory) {
  return createServer(async (request, response) => {
    if (request.method !== 'GET') {
      response.writeHead(405).end('Method not allowed');
      return;
    }
    const entry = files.get(new URL(request.url, 'http://localhost').pathname);
    if (!entry) {
      response.writeHead(404).end('Not found');
      return;
    }
    try {
      const content = await readFile(resolve(directory, entry[0]));
      response.writeHead(200, { 'Content-Type': entry[1] }).end(content);
    } catch {
      response.writeHead(500).end('Build files unavailable');
    }
  });
}
