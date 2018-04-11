# h5Plus-vue

> 一个vue项目配合hbuilder软件实现HTML5开发应用的APP

## Use
```base
本项目采用vue2.3+vuex+vue-router-es6 开发，配合hbuilder实现原生APP应用
```
## 1、使用vue-cli 创建项目

```shell
# 安装 vue-cli
npm install -g vue-cli
# 初始化项目
vue init webpack my-project
# 安装依赖
cd nuxt-ssr-demo
npm install # Or yarn install
# 启动本地服务
npm run dev
```

## 2、项目结构
```shell
├── build         ## --webpack相关配置
├── config        ## --环境配置
├── css           ## --全局CSS，作用于APP
├── js            ## --全局JS， 作用于APP
├── src           ## --vue项目资源
  ├── api         ## --相关接口处理
  ├── base        ## --页面基础组件
  ├── common      ## --项目静态资源
  ├── components  ## --项目页面
  ├── router      ## --项目路由
  ├── store       ## --vuex
static    ## --静态目录
```

## 项目打包

``` bash

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run all tests
npm test
```

## 项目编译完后

``` base
将项目下的dist目录，拷贝到hbuilder文件中，配置好相关信息manifest.json,执行在线打包
```

