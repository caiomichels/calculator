const screen = document.querySelector('.screen');
const valKeys = document.querySelectorAll('.key.val');
const oprKeys = document.querySelectorAll('.key.opr');
const equalKey = document.querySelector('.key.equal');
const prLKey = document.querySelector('.key.prL');
const prRKey = document.querySelector('.key.prR');
const pointKey = document.querySelector('.key.point');
const removeKey = document.querySelector('.key.remove');
const clearKey = document.querySelector('.key.clear');

let eqStr = '';
let eqArr = [];
let replace = false;

function decodeHtml(html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

const replaceChars = (str) => {
  return str
    .replace('+', decodeHtml('&plus;'))
    .replace('-', decodeHtml('&minus;'))
    .replace('*', decodeHtml('&times;'))
    .replace('/', decodeHtml('&divide;'))
    .replace('.', decodeHtml(','));
};

const updateScreen = () => {
  screen.innerText = replaceChars(eqArr.join(''));
  screen.scrollLeft = screen.scrollWidth;
};

Array.from(valKeys).forEach((key) => {
  key.addEventListener('click', () => {
    if (replace) {
      eqArr = [];
      eqArr.push(key.value);
      replace = false;

      updateScreen();
      return;
    }

    if (!eqArr.length || eqArr[eqArr.length - 1].match(/[^0-9.]/)) {
      eqArr.push(key.value);
    } else {
      eqArr[eqArr.length - 1] += key.value;
    }

    updateScreen();
  });
});

pointKey.addEventListener('click', () => {
  if (!eqArr.length || eqArr[eqArr.length - 1].match(/\D/) || replace) return;

  eqArr[eqArr.length - 1] += '.';

  updateScreen();
});

Array.from(oprKeys).forEach((key) => {
  key.addEventListener('click', () => {
    replace = false;

    if (!eqArr.length || eqArr[eqArr.length - 1].match(/\(|\.$/)) return;

    if (eqArr[eqArr.length - 1].match(/[\d)]/)) {
      eqArr.push(key.value);
    } else {
      eqArr[eqArr.length - 1] = key.value;
    }

    updateScreen();
  });
});

prLKey.addEventListener('click', () => {
  if (eqArr[eqArr.length - 1].match(/\(|\.$/)) return;

  replace = false;

  if (eqArr[eqArr.length - 1].match(/[\d)]/)) {
    eqArr.push('*');
    eqArr.push('(');
  } else if (eqArr[eqArr.length - 1].match(/[+\-*\/]/)) {
    eqArr.push('(');
  }

  updateScreen();
});

prRKey.addEventListener('click', () => {
  replace = false;

  let prLAmount = eqArr.filter((val) => val == '(').length;
  let prRAmount = eqArr.filter((val) => val == ')').length;

  if (
    prLAmount <= prRAmount ||
    eqArr[eqArr.length - 1] == '(' ||
    eqArr[eqArr.length - 1].match(/\(|\.$/)
  )
    return;

  if (eqArr[eqArr.length - 1].match(/[^\d(.]/)) {
    eqArr[eqArr.length - 1] = ')';
  } else {
    eqArr.push(')');
  }

  updateScreen();
});

equalKey.addEventListener('click', () => {
  if (!eqArr[eqArr.length - 1].match(/[\d)]/)) eqArr.pop();
  eqStr = eqArr.join('');
  eqArr = [''];
  eqArr[0] = parseFloat(eval(eqStr).toFixed(10)).toString();
  updateScreen();
  replace = true;
});

removeKey.addEventListener('click', () => {
  if (!eqArr.length) return;

  let last = eqArr[eqArr.length - 1];

  if (eqArr[eqArr.length - 1].length == 1) {
    eqArr.pop();
  } else {
    eqArr[eqArr.length - 1] = last.slice(0, last.length - 1);
  }

  updateScreen();
});

clearKey.addEventListener('click', () => {
  eqArr = [];
  updateScreen();
});
