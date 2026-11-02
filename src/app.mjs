import { calculatePayable, parseYuan, formatYuan } from './pricing.mjs';

const form = document.querySelector('#calculator');
const amount = document.querySelector('#amount');
const payable = document.querySelector('#payable');
const discount = document.querySelector('#discount');
const error = document.querySelector('#error');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const cents = parseYuan(amount.value);
    const result = calculatePayable(cents);
    payable.textContent = `应付 ¥${formatYuan(result)}`;
    discount.textContent = `已优惠 ¥${formatYuan(cents - result)}`;
    error.textContent = '';
  } catch (cause) {
    error.textContent = cause.message;
    payable.textContent = '请检查输入金额';
    discount.textContent = '';
  }
});
form.requestSubmit();
