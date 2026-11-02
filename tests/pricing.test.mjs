import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePayable, parseYuan, formatYuan } from '../src/pricing.mjs';

for (const [name, input, expected] of [
  ['零元订单', 0, 0],
  ['门槛前一分：99.99元不优惠', 9999, 9999],
  ['刚好达到门槛：100元应付80元', 10000, 8000],
  ['门槛后一分：100.01元应付80.01元', 10001, 8001],
  ['200元只减一次20元', 20000, 18000],
  ['支持的最大金额', 99_999_999_999, 99_999_997_999],
]) {
  test(name, () => assert.equal(calculatePayable(input), expected));
}

test('拒绝负数、小数分、非数字和越界金额', () => {
  for (const value of [-1, 1.5, NaN, Infinity, '10000', null, 100_000_000_000]) {
    assert.throws(() => calculatePayable(value), RangeError);
  }
});

for (const [input, expected] of [['0', 0], ['0.01', 1], ['100', 10000], ['100.1', 10010], [' 100.00 ', 10000]]) {
  test(`金额文本“${input}”转换为整数分`, () => assert.equal(parseYuan(input), expected));
}

test('拒绝空白、负数、超过两位小数及不支持的写法', () => {
  for (const value of ['', ' ', '-1', '100.001', 'abc', '1e2', '.5', '01', '1000000000', null]) {
    assert.throws(() => parseYuan(value), RangeError);
  }
});

test('展示金额始终保留两位小数', () => {
  assert.equal(formatYuan(0), '0.00');
  assert.equal(formatYuan(1), '0.01');
  assert.equal(formatYuan(8001), '80.01');
});

test('展示函数拒绝无效金额', () => assert.throws(() => formatYuan(-1), RangeError));
