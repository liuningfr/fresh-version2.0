/**
 * getScript - 加载 js 文件
 */
const getScript = (url) =>
  new Promise((resolve, reject) => {
    let script = document.createElement('script');
    const firstScript = document.getElementsByTagName('script')[0];
    script.async = true;
    script.defer = true;

    const onLoadHandler = (event, isAbort) => {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = null;
        script.onreadystatechange = null;
        script = undefined;

        !isAbort ? resolve() : reject();
      }
    };
    script.onload = onLoadHandler;
    script.onreadystatechange = onLoadHandler;

    script.src = url;
    firstScript.parentNode.insertBefore(script, firstScript);
  });

export default getScript;
