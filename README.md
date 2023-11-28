# 使用说明

```sh
yarn
```

### 服务端
```sh
yarn serve

sudo docker run -it \
  -d \
  --rm \
  -v /home/max/data:/upload \
  -p 0.0.0.0:30000:3000 \
  --name "post_server" \
  xiaoliu654321/linshi:latest yarn serve
```

### 客户端
```sh
npx ts-node src/index.ts client /path/post_data
```
