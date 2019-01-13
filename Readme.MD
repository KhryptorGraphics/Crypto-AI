- Instal nodejs
- sudo npm install express-generator -g
- change directory to the project folder
- Install postgresql (npm install --save pg pg-hstore)
- npm install 
- in config/config.json define the username/password for the postgres connection
- create postgresql user and database , type following commands in command prompt
     i) psql postgres --u {database name}
     ii) postgres-# CREATE ROLE {username} WITH LOGIN PASSWORD {'password'};
     iii) postgres-# ALTER ROLE {username} CREATEDB;
      
     iv) Quit `psql` then log in again using the new user that previously created.
            postgres-# \q
            psql postgres -U djamware
            
     V) postgres=> CREATE DATABASE {database name};
     vi) postgres=> GRANT ALL PRIVILEGES ON DATABASE {dabatase_name} TO {username};
         postgres=> \q
         
         
- sequelize db:migrate

     
