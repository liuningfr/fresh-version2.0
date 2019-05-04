#!/bin/sh

echo "Deploy to $1"
npm run build

if [ $? -ne 0 ]; then
exit 1
fi

rm -rf ./output
mkdir -p ./output/webroot/manage
mkdir -p ./output/webroot/static

cp ./build/index.html ./output/webroot/manage/index.php
cp ./build/favicon.ico ./output/webroot/favicon.ico
cp -r ./build/static/* ./output/webroot/static

npm run deploy $1
