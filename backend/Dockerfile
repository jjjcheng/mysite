# 使用完整的 Debian 版 node18，支持 sqlite3 编译
FROM node:18-bullseye

WORKDIR /app

# 复制依赖定义文件
COPY package*.json ./

# 安装编译依赖并安装 npm 包
RUN apt-get update && apt-get install -y python3 make g++ \
    && npm install --force \
    && apt-get remove -y python3 make g++ \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# 复制源代码
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
