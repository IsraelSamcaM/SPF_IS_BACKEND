module.exports = {
  HOST: "containers-us-west-109.railway.app",
  USER: "postgres",
  PASSWORD: "3NrdUh8AYorUGcWEZRea",
  DB: "railway",
  dialect: "postgres",
  port: "6479", 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};


