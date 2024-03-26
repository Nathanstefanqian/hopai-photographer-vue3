echo '编译项目'
npm run build

echo '推送到服务器'
scp -r ./dist/* c-server:/photo
echo '--Done--'