import assert from 'node:assert/strict';
import { once } from 'node:events';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createStaticServer } from './static-server.mjs';

const directory = process.argv[2] || 'dist';
const server = createStaticServer(directory);
try {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  const expected = [
    ['/', 'text/html', 'id="calculator"'],
    ['/app.mjs', 'text/javascript', "'./pricing.mjs'"],
    ['/pricing.mjs', 'text/javascript', 'calculatePayable'],
    ['/style.css', 'text/css', ':root'],
  ];
  for (const [path, contentType, text] of expected) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 200, `${path} 应成功访问`);
    assert.ok(response.headers.get('content-type')?.startsWith(contentType));
    assert.ok((await response.text()).includes(text), `${path} 内容不符合预期`);
  }
  assert.equal((await fetch(`${origin}/missing`)).status, 404);
  const { calculatePayable } = await import(pathToFileURL(resolve(directory, 'pricing.mjs')).href);
  assert.equal(calculatePayable(9999), 9999);
  assert.equal(calculatePayable(10000), 8000);
  assert.equal(calculatePayable(10001), 8001);
  console.log(`[SMOKE PASS] ${directory}/：4个资源HTTP检查、404检查和3个金额边界检查通过。`);
} finally {
  server.closeAllConnections();
  await new Promise((resolveClose) => server.close(resolveClose));
}
