@echo off
cd /d %~dp0
if not exist node_modules npm install --registry=https://registry.npmmirror.com
echo 斟知知识库 Node 后端启动中: http://127.0.0.1:8019
node src/app.js
