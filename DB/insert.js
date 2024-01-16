const client = require('./db')

async function getData(){
    const data = await fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((json) => { return json; });
    return data;
  }
  
  
  async function pushDataToDb(){
    const data = await getData();
    data.map(async (user) => {
      const res = await client.query(
        `INSERT INTO STUDENT (name, age, email) 
         VALUES ($1, $2, $3)`, [user.name, user.email, user.id*5]);
      if (res){
        console.log('sucessfully inserted', user.name, res.command);
      } else {
        console.log('not able to inserted', user.name, res.command);
      }
      
    })
  }

  module.exports = {
    pushDataToDb
  }