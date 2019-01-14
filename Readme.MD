The following tools, frameworks, and modules are required for this Program:

- Node.js
- PostgreSQL Server
- Express.js
- Sequelize.js


 i)Install nodejs
 ii) Install express
     - sudo npm install express-generator -g
 iii) Install PostgreSQL Server
 iv) Change directory to the project folder
 v) Install sequelize
     - sudo npm install -g sequelize-cli
 vi) Type 'npm install' in the project folder. It will install all the other required dependencies 
 vii) Create database and user (install the following commands)
     - in config/config.json of the project folder, define the username/password for the postgres connection
     - In command prompt
         => psql postgres --u postgres
         => postgres-# CREATE ROLE {username} WITH LOGIN PASSWORD {'password'};
         => postgres-# ALTER ROLE {username} CREATEDB;
         => postgres-# \q
         => psql postgres -U {username}
         => postgres=>
         => postgres=> CREATE DATABASE {database_name};
         => postgres=> GRANT ALL PRIVILEGES ON DATABASE {database_name} TO {username};
         => postgres=> \q
         => sequelize db:migrate
         
    viii) Install pgAdmin4 to verify that the database connection is working properly
    
    

     
