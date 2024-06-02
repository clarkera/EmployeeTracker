const { Client } = require('pg'); 

const connectDb = () => {   
  const client = new Client({  
    user: 'postgres',
    host: 'localhost',
    database: 'employeetracker2',
    password: 'Mittens94$',
    port: 5432,
  });

  client.connect(err => { 
    if (err) {
      console.error('Connection error', err.stack);
    } else {
      console.log('Connected to the database.');
    }
  });

  return client; 
};

module.exports = connectDb; 