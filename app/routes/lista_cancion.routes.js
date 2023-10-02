module.exports = app => {
    const lista_canciones = require("../controllers/lista_cancion.controller.js");
  
    var router = require("express").Router();
  
    // router para crear una lista de canciones
    router.post("/", lista_canciones.create);
    
    router.post("/createlist/", lista_canciones.createlist);
  
    // router para encontrar todas las listas de canciones
    router.get("/", lista_canciones.findAll);

    // router para encontrar todas las listas con sus canciones asociadas 

    router.get("/getcompleto", lista_canciones.findAllMusic);
  
    // router para obtener una sola lista de canciones por su id
    router.get("/:id", lista_canciones.findOne);
  
    // router para actualizar una lista de canciones por su id
    router.put("/:id", lista_canciones.update);
  
    // router para eliminar una lista de canciones por su id
    router.delete("/:id", lista_canciones.delete);
  
    // router para obtener una lista de canciones por su nombre
    router.get("/search/:searchTerm", lista_canciones.searchByTitle);
  
    app.use("/api/lista_canciones", router);
  };