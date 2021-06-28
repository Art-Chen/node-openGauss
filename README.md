English | [简体中文](README(CHN).md)

# demand
  Node-OpenGauss is implemented based on Node-PostGre.Achieve SHA256 encryption connection

# node-opengauss

A simple [openGauss](https://opengauss.org) client for Node.js based on [node-postgres](https://github.com/brianc/node-postgres).

## Install

```
npm install
```

##  Test Case

```javascript
const { Pool, Client } = require('./lib')


const pgConfig = {
  user: '*********',
  database: 'postgres',
  password: '********',
  host: '************',
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

## Development

Development on MacOS/Linux is preferred :)

1. Please deploy OpenGauss on `CentOS 7` or `openEuler 20.3 LTS`
2. Ensure you have a openGauss instance running, follow this https://opengauss.org/zh/docs/2.0.1/docs/Quickstart/Quickstart.html to set up it


### Run the project

Navigate to `examples` and run following to test driver:

```bash
/*
  example
*/
cd packages/pg/  
node test-1.js
```

## Notes

- [Configure the client access authentication method](https://opengauss.org/zh/docs/2.0.1/docs/Developerguide/%E9%85%8D%E7%BD%AE%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%8E%A5%E5%85%A5%E8%AE%A4%E8%AF%81.html)
- [Please refer to here for specific implementation]
  (https://github.com/brianc/node-postgres)
- [Refer to the JDBC driver for encryption]
  (https://gitee.com/opengauss/openGauss-connector-jdbc)

## Posts


- [SEMMNI ERROR]

  When doing simpleinstall, we may get this error
  
  `"On systemwide basis, the maximum number of SEMMNI is not correct. the current SEMMNI value is: .... Please check it."`

  According to the installation script, SEMMNI should be greater than 321.875

  On CentOS 7 we can do this to modify it
  ``` bash
  $ sudo vim /etc/sysctl.conf
  ```
  Add this line to the end of file

  `kernel.sem = 250 32000 100 400`

  Then use `shift + double z` or `:wq` to save and exit the `vim`

  Finally execute it to apply our settings
  ``` bash
  $ /sbin/sysctl -p 
  ```

- [The account was locked]

  Enter the gsql on your server

  Then run this

  alter user <i>`[username]`</i> account unlock;

- [Adding IPv4 rules allows all external links to the password to be verified by SHA256]

  Open this file: `/opt/software/openGauss/data/single_node/pg_hba.conf`

  add this:     `host    all        all         0.0.0.0/0           sha256 `

- [GUC]
  
  Click [here](https://opengauss.org/zh/docs/1.0.0/docs/Quickstart/GUC%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E.html)

