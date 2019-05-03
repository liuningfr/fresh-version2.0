// 阿拉伯数字转换为简写汉字

const convertCurrency = (Num) => {
  let Numbers = Num;
  for (let i = 0; i < Numbers.length - 1; i += 1) {
    Numbers = Numbers.replace(',', '');
    Numbers = Numbers.replace(' ', '');
  }
  if (Number.isNaN(Numbers)) {
    return '';
  }
  const part = String(Numbers).split('.');
  let newchar = '';
  for (let i = part[0].length - 1; i >= 0; i -= 1) {
    let tmpnewchar = '';
    const perchar = part[0].charAt(i);
    switch (perchar) {
      case '0':
        tmpnewchar = `零${tmpnewchar}`;
        break;
      case '1':
        tmpnewchar = `一${tmpnewchar}`;
        break;
      case '2':
        tmpnewchar = `二${tmpnewchar}`;
        break;
      case '3':
        tmpnewchar = `三${tmpnewchar}`;
        break;
      case '4':
        tmpnewchar = `四${tmpnewchar}`;
        break;
      case '5':
        tmpnewchar = `五${tmpnewchar}`;
        break;
      case '6':
        tmpnewchar = `六${tmpnewchar}`;
        break;
      case '7':
        tmpnewchar = `七${tmpnewchar}`;
        break;
      case '8':
        tmpnewchar = `八${tmpnewchar}`;
        break;
      default:
        tmpnewchar = `九${tmpnewchar}`;
        break;
    }
    newchar = tmpnewchar + newchar;
  }
  // 替换所有无用汉字，直到没有此类无用的数字为止
  while (
    newchar.search('零零') !== -1 ||
    newchar.search('零亿') !== -1 ||
    newchar.search('亿万') !== -1 ||
    newchar.search('零万') !== -1
  ) {
    newchar = newchar.replace('零亿', '亿');
    newchar = newchar.replace('亿万', '亿');
    newchar = newchar.replace('零万', '万');
    newchar = newchar.replace('零零', '零');
  }
  // 替换以“一十”开头的，为“十”
  if (newchar.indexOf('一十') === 0) {
    newchar = newchar.substr(1);
  }
  // 替换以“零”结尾的，为“”
  if (newchar.lastIndexOf('零') === newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1);
  }
  return newchar;
};

export default convertCurrency;
