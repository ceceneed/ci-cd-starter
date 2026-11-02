import { createStaticServer } from './static-server.mjs';

const server = createStaticServer('dist');
server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
server.listen(4173, '127.0.0.1', () => {
  console.log('本地页面：http://127.0.0.1:4173；按 Ctrl+C 停止。');
});
