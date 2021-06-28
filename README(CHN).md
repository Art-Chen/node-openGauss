[English](README.md) | 简体中文

# 需求分析
    基于Node-postGres实现openGauss数据库的js连接驱动，实现SHA256加密方式连接。

# node-opengauss

基于[node-postgres](https://github.com/brianc/node-postgres)的Node.js简单的[openGauss](https://opengauss.org)驱动.

## 安装

```javascript
    npm install
```

## 测试用例

```javascript
const { Pool, Client } = require('./lib')
const isMd5 = false
const client = true

const pgConfig = {
  user: '********',
  database: 'postgres',
  password: '******',
  host: '********',
  port: 5432,
}
const pool = new Pool(pgConfig)

pool.on('error', (err, result) => {
  return console.error('catch error: ', err)
})

pool.connect((err, client, release) => {
  if (err) {
    return console.log('can not connect to postgresql server.')
  }
  client.query('DROP TABLE test;')
  client.query(`CREATE TABLE test
  (
      c_customer_sk             integer
  );`)
  client.query('insert into test values(1111)', (err, res) => {
    console.log(res)
  })
  client.query('update test set c_customer_sk = 2222', (err, res) => {
    console.log(res)
  })
  client.query('SELECT * FROM test;', (err, res) => {
    console.log(res)
  })
  client.query('delete from test where c_customer_sk = 2222', (err, res) => {
    console.log(res)
  })
  client.query('SELECT * FROM test;', (err, res) => {
    console.log(res)
  })
  release()
  return console.log('connect to postgresql successfully!')
})
function rollback(client) {
  //terminating a client connection will
  //automatically rollback any uncommitted transactions
  //so while it's not technically mandatory to call
  //ROLLBACK it is cleaner and more correct
  return client
    .query('ROLLBACK')
    .then(() => client.end())
    .catch(() => client.end())
}

```

## 开发环境

    推荐MacOS/Linux系统开发

1. Open-Gauss请部署在  `Centos7`  或  `openEuler 20.3 LTS`
   
2. 请根据[这里](https://opengauss.org/zh/docs/2.0.1/docs/Quickstart/Quickstart.html)来快速部署一个简单的openGauss实例


### 运行

请按照下面的命令来测试驱动

```bash
cd packages/pg/  
node test-1.js
```

## 说明

- [配置客户端接入认证方式](https://opengauss.org/zh/docs/2.0.1/docs/Developerguide/%E9%85%8D%E7%BD%AE%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%8E%A5%E5%85%A5%E8%AE%A4%E8%AF%81.html)

- 驱动具体实现参考[node-postGres](https://github.com/brianc/node-postgres)

- SHA256加密实现参考[openGauss-connector-jdbc](https://gitee.com/opengauss/openGauss-connector-jdbc)

## 注意事项

- [安装时SEMMNI错误]

    简易安装的时候，可能会遇到以下错误
  
   `"On systemwide basis, the maximum number of SEMMNI is not correct. the current SEMMNI value is: .... Please check it."`

  根据安装脚本计算出，信号量SEMMNI应该大于321.875

  在CentOS 7 可以用一下命令修改 SEMMNI

  ```bash
  $ sudo vim /etc/sysctl.conf
  ```

  添加以下数据到文件末尾

  `kernel.sem = 250 32000 100 400`

  使用指令 `shift+ double z` 或者 `:wq`保存文件修改

  最后执行修改

  ```bash
  $ /sbin/sysctl -p
  ```

- [账号锁定]
  
    openGauss账号被锁定解决办法，进入openGauss输入以下命令:
    [database_name]#  alter user [username] account unlock;

- [添加IPv4规则允许所有外部链接的密码都由SHA256验证]

    打开/opt/software/openGauss/data/single_node/pg_hba.conf
    添加以下数据
    add this:     `host    all        all         0.0.0.0/0           sha256 `
    详情请看[这里](https://opengauss.org/zh/docs/1.0.0/docs/Quickstart/GUC%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E.html)