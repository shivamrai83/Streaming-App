const { Client } = require('pg');

const pgClient = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

const client = new Client(pgClient);

client.connect(function(err) {
  if (err) throw err;
  console.log("Postgres Connected!");
});

async function getUser(){
  try {
    const data  = await client.query('SELECT  * FROM  student');
    return data.rows;
  } catch (error) {
      console.log('ERROR INSIDE getUser', error.stack);
      return false;
  }
}


async function insertUser(name, age, email){
    try {
        // await client.connect();
        await client.query(
            `INSERT INTO STUDENT (name, age, email) 
             VALUES ($1, $2, $3)`, [name, age, email]);
        return true;
    } catch (error) {
        console.log('ERROR INSIDE insertUser', error.stack);
        return false;
    }
};

module.exports = {
  insertUser,
  getUser
};