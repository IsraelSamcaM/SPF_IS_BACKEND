module.exports = app => {
    const extra_playlist = require("../controllers/extra_playlist.controller.js");
  
    var router = require("express").Router();
  
   // router para añadir una cancion a una lista de canciones
    router.post("/", extra_playlist.create);
  
    // router para encontrar todas las canciones
    router.delete("/", extra_playlist.delete);
  
    app.use("/api/extra_playlist", router);
  };