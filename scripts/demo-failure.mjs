import { mkdir, mkdtemp, cp, readFile, writeFile, access, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { join, resolve, dirname } from 'node:path';

const sandboxRoot = resolve('.demo-work');
await mkdir(sandboxRoot, { recursive: true });
const sandbox = await mkdtemp(join(sandboxRoot, 'failure-'));
const original = await readFile('src/pricing.mjs', 'utf8');
try {
  for (const directory of ['src', 'tests', 'scripts']) {
    await cp(directory, join(sandbox, directory), { recursive: true });
  }
  const broken = original.replace('totalCents >= 10_000', 'totalCents > 10_000');
  assert.notEqual(broken, original, '需要找到教学用的优惠门槛判断');
  await writeFile(join(sandbox, 'src/pricing.mjs'), broken);
  console.log('只在隔离副本引入错误：满100元改成超过100元才优惠。');
  const result = spawnSync(process.execPath, ['scripts/pipeline.mjs'], { cwd: sandbox, stdio: 'inherit' });
  assert.ok(!result.error && result.status !== null && result.status !== 0, '错误应让流水线失败');
  for (const directory of ['dist', 'release']) {
    await assert.rejects(access(join(sandbox, directory)), { code: 'ENOENT' });
  }
  assert.equal(await readFile('src/pricing.mjs', 'utf8'), original);
  console.log('\n[EXPECTED FAILURE VERIFIED] 边界测试发现错误；构建和部署均未执行；源文件保持正确。');
  console.log('本演示命令退出码为0，表示已成功验证“错误会阻止发布”。');
} finally {
  assert.equal(dirname(resolve(sandbox)), sandboxRoot, '只清理本项目的隔离副本');
  await rm(sandbox, { recursive: true, force: true });
}
