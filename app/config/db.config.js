module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "13033162",
  DB: "db_spotify_is",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};


