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
  -v ${data_dir}:/data \
  --name "post_${gpuID}" \
  minerdao/spacemesh:v1.26 bash -c "${shell}"
```

### 客户端
```sh
npx ts-node src/index.ts client /path/post_data
```
