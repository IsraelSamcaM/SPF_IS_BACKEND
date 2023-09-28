module.exports = app => {
    const lista_canciones = require("../controllers/lista_cancion.controller.js");
  
    var router = require("express").Router();
  
    // ruteo para crear lista de canciones
    router.post("/", lista_canciones.create);
  
    // obtener todas las listas de canciones
    router.get("/", lista_canciones.findAll);
  
    // obtener una sola lista de canciones con su id
    router.get("/:id", lista_canciones.findOne);
  
    // actualizar una lista de canciones
    router.put("/:id", lista_canciones.update);
  
    // eliminar una lista de canciones
    router.delete("/:id", lista_canciones.delete);
  
    // // Search por titulo Tutorials
    //router.get("/search/", lista_canciones.searchByTitle);
  
    app.use("/api/lista_canciones", router);
  };