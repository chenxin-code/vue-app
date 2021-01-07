#!/bin/bash

server="47.97.215.145"
path="/software/develop/10014/vueapp"
user="root"
password="Yanghf*1024"


server="139.224.74.177"
#path="/home/sunbox/client/conf/static/system-vue/app"
path="/home/sunbox/client/conf/static/app-vue/app"
user="root"
password="WLyvxwDatEn5zveZ"

#server="47.99.218.37"
#path="/home/sunbox/client/conf/static/system-vue/app"
#user="root"
#password="JXsinopec123!"


npm run build || { echo "编译失败！"; exit 1; }

echo "编译成功！，马上开始上传到服务器！"

sleep 1

apppath=$(cd `dirname $0`; pwd)'/app/*'

appfiles=$(echo $apppath)

expect -c "
spawn scp -r ${appfiles} ${user}@${server}:${path}
expect {
\"*assword\" {set timeout 300; send \"${password}\r\";}
\"yes/no\" {send \"yes\r\"; exp_continue;}
}
expect eof" || { echo "复制文件到服务器失败！"; exit 1; }

echo "发布成功！处理版本更新！"

exit 1;

sleep 1

echo "压缩app.zip"

zip -r app.zip ./app

echo "压缩app.zip完成，更新版本信息！"

expect -c "
spawn scp -r ${user}@${server}:${path}/version.json ./
expect {
\"*assword\" {set timeout 300; send \"${password}\r\";}
\"yes/no\" {send \"yes\r\"; exp_continue;}
}
expect eof"

sleep 1

version=`cat version.json | sed -n '3p'`
fstr=`echo $version | cut -d \. -f 1`
sstr=`echo $version | cut -d \. -f 2`
tstr=`echo $version | cut -d \. -f 3`
buildversion=`echo $tstr | cut -d \" -f 1`
buildversion1=$((buildversion+1))
versionline="${fstr}.${sstr}.${buildversion1}\","
sed "3 c\   
${versionline}
" version.json >> version1.json
mv version1.json version.json

sleep 1

argv1=$1
if [[ $argv1 == force ]]; then
forceversion=`cat version.json | sed -n '4p'`
fstr1=`echo $forceversion | cut -d \: -f 1`
version=`cat version.json | sed -n '3p'`
sstr1=`echo $version | cut -d \: -f 2`
sstr2=`echo $sstr1 | cut -d \, -f 1`
forceversionline="${fstr1}:${sstr2}"
sed "4 c\   
${forceversionline}
" version.json >> version1.json
mv version1.json version.json
fi

expect -c "
spawn scp -r ./version.json ./app.zip ${user}@${server}:${path}
expect {
\"*assword\" {set timeout 300; send \"${password}\r\";}
\"yes/no\" {send \"yes\r\"; exp_continue;}
}
expect eof"

sleep 1

rm -f version.json app.zip

echo "完成！"



