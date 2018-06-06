import './style.styl';

const $  = (str) => document.querySelector(str);
const $$ = (str) => document.querySelectorAll(str);

const all = (arr) => {
  for (let item of arr) {
    if (!item) return false;
  }
  return true;
}

const count = (arr) => {
  let res = 0;
  for (let item of arr) {
    if (item) ++ res;
  }
  return res;
}

$$('.__quiz_btn__').forEach((el) => {
  const _root = el.parentElement;
  el.addEventListener('click', (e) => {
    const res = count(Array.from(_root.querySelectorAll('.__quiz_prob__')).map((prob) => {
      return all(Array.from(prob.querySelectorAll('input')).map((input) => {
        return input.checked === (input.getAttribute('data-ans') === 'true');
      }));
    }));
    const num = _root.querySelectorAll('.__quiz_prob__').length;
    _root.querySelector('.__quiz_sol__').innerHTML = `Result: ${res}/${num}`
  })
})

