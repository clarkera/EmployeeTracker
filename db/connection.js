const { Client } = require('pg'); // Import the pg module which is a PostgreSQL client for Node.js

const connectDb = () => {   // Define a function to connect to the PostgreSQL database
  const client = new Client({  // Create a new instance of the Client with the database connection details
    user: 'postgres',
    host: 'localhost',
    database: 'employeetracker2',
    password: 'Mittens94$',
    port: 5432,
  });

  client.connect(err => { // Connect to the database
    if (err) {
      console.error('Connection error', err.stack);
    } else {
      console.log('Connected to the database.');
    }
  });

  return client; // Return the client instance to allow further operations on the database
};

module.exports = connectDb; // Export the connectDb function so it can be used in other modules