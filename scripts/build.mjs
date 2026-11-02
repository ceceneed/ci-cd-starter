import { mkdir, copyFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'style.css', 'app.mjs', 'pricing.mjs']) {
  await copyFile(`src/${file}`, `dist/${file}`);
}
console.log('[BUILD PASS] 已生成 dist/，它就是本次可发布的文件包。');
