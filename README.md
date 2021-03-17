# 涉及的技术

- node
- nvm
- parse-server（javascript sdk & node sdk）
- mongodb
- nginx
- pm2
- antd
- react

# Starting 

项目构成

- cms 为PC后台项目
- cms2（暂时废弃）
- nginx 是nginx的部署配置文件
- server 为后端服务

# 代码位置

所有代码放在github上的个人私有仓库中。请把github账号和 ssh-key发给我，我加上访问权限。

https://github.com/xugy0926/fenghuan-react-app

# server

整体框架是基于express，但是采用了parse-server + mongodb 的方案，parse-server 提供了前后端访问数据的方式，这样可以更好的通过类的操作来操作数据对象。详细请参考
 https://docs.parseplatform.org/ 。
 
 ### 关于渠道处理
 
 ![image](https://user-images.githubusercontent.com/3000884/111422005-ebd55380-8728-11eb-92bb-701da3f1da8e.png)

 
在前期，因为接入的渠道较少，当时是每家都独立路由（参考app.js的路由）、独立控制，类似server/channel中的artifact.js dianzhong.js heiyan.js 等。

在后期，随着接入越来越多，重复处理和逻辑会导致大部分逻辑无法共用。所有就统一路由和逻辑处理。在app.js中，通过分析query参数来区分不同的渠道。在 server/channel/main.js 中做统一逻辑处理（数据读取&整理），然后在 custom.js 根据不同渠道的差异来进行内容的分发。

### 关于安全处理

一般对渠道的要求是提供白名单ip。在app.js中，在处理具体路由之前统一进行了ip的验证。为了测试方便，可以在访问的接口链接上加入 is_test=0 的方式，关闭ip验证。

另外还提供了加密验证。即每家渠道都定义唯一的client_id 和 client_secret 串。在获取不同数据时加密方式如下。

访问书列表 md5(client_id + client_secret)

访问某本书信息 md5(client_id + client_secret + book_id)

访问某本书的章节信息 md5(client_id + client_secret + book_id + chapter_id)

验证方式都在utils.js 定义好，分别是sign1、sign2、sign3 。路由路径中都已经使用了这些验证，所以后期不必修改这部分内容。


### 自动化测试

所有渠道都有针对接口的自动化测试。因为每接一家都可能对以往的内容产生影响。测试比较重要。这里引入了mocha的方案。具体代码参考 server/test

```
npm run test
```

#### 渠道接入的差异点问题，

每家渠道对内容的要求都不一样。内容不同可以通过对方要求的字段一一抹平即可。可以在 custom.js 中分别处理。

但是对后续有冲击的主要是两个点：

1、推和拉两种接入方式。

之前接了两家以推方式能力。代码在cloud/functions/dangdu.js cloud/functions/yuewen.js 中。推的动作是在后台点击触发。

dangdu.js 大部分逻辑写完，但是由于没有时间跟他们联调，所以暂时是不可用状态。yuewen.js 已经联调完成。

2、每家渠道对书的分类不同。

分类无法标准化，最笨的方式就是在pc后台每家都做分类的填写。然后



### 本地开发

```
cd ./server
yarn
node app.js
```


### 线上部署
```
cd ./server
yarn
NODE_ENV=production pm2 start app.js
```
