const { Pool, Client } = require('./lib')
const isMd5 = false
const client = true

const pgConfig = {
  user: 'chen',
  database: 'postgres',
  password: 'Aa123456',
  host: '192.168.19.120',
  port: 5432,
}
const pool = new Pool(pgConfig)

pool.on('error', (err, result) => {
  return console.error('catch error: ', err)
})

pool.connect((err, client, release) => {
  if (err) {
    return console.log('can not connect to openGauss server.')
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
