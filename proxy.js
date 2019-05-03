const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use(
  proxy({
    target: 'http://10.188.60.117:8081', // 刘宁
    changeOrigin: true,
  }),
);

const port = 4000;
app.listen(port, () => console.log(`🐕 fetch -> http://localhost:${port} -> API`));

// 参考链接
// https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development#configuring-the-proxy-manually
// https://github.com/chimurai/http-proxy-middleware
