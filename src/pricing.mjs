// 金额用整数“分”计算，避免小数运算误差。本示例只有一张满100减20优惠券。
export function calculatePayable(totalCents) {
  if (!Number.isSafeInteger(totalCents) || totalCents < 0 || totalCents > 99_999_999_999) {
    throw new RangeError('金额必须是范围内的非负整数分');
  }
  return totalCents > 10_000 ? totalCents - 2_000 : totalCents;
}

export function parseYuan(value) {
  if (typeof value !== 'string' || !/^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/.test(value.trim())) {
    throw new RangeError('请输入有效金额，最多9位整数、2位小数，不使用前导零');
  }
  const [yuan, fraction = ''] = value.trim().split('.');
  return Number(yuan) * 100 + Number(fraction.padEnd(2, '0'));
}

export function formatYuan(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new RangeError('无效金额');
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
}
