import { spawnSync } from 'node:child_process';
import { mkdir, copyFile } from 'node:fs/promises';

const checks = [
  ['测试业务规则', ['--test', 'tests/pricing.test.mjs']],
  ['构建可发布文件', ['scripts/build.mjs']],
  ['检查构建产物', ['scripts/smoke.mjs']],
];

for (const [name, arguments_] of checks) {
  console.log(`\n>>> ${name}`);
  const result = spawnSync(process.execPath, arguments_, { stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    console.error(`[PIPELINE STOP] ${name}失败，后续步骤停止，本次不执行部署。`);
    process.exit(result.status || 1);
  }
}

// 用复制到 release/ 模拟“把本次已经检查过的产物交给运行环境”。
await mkdir('release', { recursive: true });
for (const file of ['index.html', 'style.css', 'app.mjs', 'pricing.mjs']) {
  await copyFile(`dist/${file}`, `release/${file}`);
}
console.log('\n[LOCAL DEPLOY] 已复制到 release/，这是本地部署演示。');
const smoke = spawnSync(process.execPath, ['scripts/smoke.mjs', 'release'], { stdio: 'inherit' });
if (smoke.error || smoke.status !== 0) process.exit(smoke.status || 1);
console.log('[PIPELINE PASS] 测试 → 构建 → 产物检查 → 本地部署 → 部署后检查全部通过。');
