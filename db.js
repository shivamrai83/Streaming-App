const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// async function insertUser(name, age, email){
//     try {
//         // await client.connect();
//         await client.query(
//             `INSERT INTO STUDENT (name, age, email) 
//              VALUES ($1, $2, $3)`, [name, age, email]);
//         return true;
//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     } finally {
//         await client.end();
//     }
// };

module.exports = client;