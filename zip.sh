#!/bin/sh

TIME=`date +%m%d-%H%M`
npm run build

if [ $? -ne 0 ]; then
exit 1
fi

rm -rf *.zip
mkdir -p ./output/webroot/manage
mkdir -p ./output/webroot/static

cp ./build/index.html ./output/webroot/manage/index.php
cp ./build/favicon.ico ./output/webroot/favicon.ico
cp -r ./build/static/* ./output/webroot/static

zip -qr fresh-${TIME}.zip ./output
rm -rf ./build ./output
