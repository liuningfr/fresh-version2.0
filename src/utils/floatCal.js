export default () => {
  const accAdd = (num1, num2) => {
    let r1;
    let r2;
    let m;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); // eslint-disable-line
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m; // eslint-disable-line
  };

  // 两个浮点数相减
  const accSub = (num1, num2) => {
    let r1;
    let r2;
    let m;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); // eslint-disable-line
    const n = r1 >= r2 ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n); // eslint-disable-line
  };
  // 两数相除
  const accDiv = (num1, num2) => {
    let t1;
    let t2;
    let r1;
    let r2;
    try {
      t1 = num1.toString().split('.')[1].length;
    } catch (e) {
      t1 = 0;
    }
    try {
      t2 = num2.toString().split('.')[1].length;
    } catch (e) {
      t2 = 0;
    }
    r1 = Number(num1.toString().replace('.', '')); // eslint-disable-line
    r2 = Number(num2.toString().replace('.', '')); // eslint-disable-line
    return (r1 / r2) * Math.pow(10, t2 - t1); // eslint-disable-line
  };

  const accMul = (num1, num2) => {
    let m = 0;
    const s1 = num1.toString();
    const s2 = num2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {} // eslint-disable-line
    try {
      m += s2.split('.')[1].length;
    } catch (e) {} // eslint-disable-line
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m); // eslint-disable-line
  };

  return {
    accAdd,
    accSub,
    accDiv,
    accMul,
  };
};
