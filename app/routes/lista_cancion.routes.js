module.exports = app => {
    const lista_canciones = require("../controllers/lista_cancion.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", lista_canciones.create);
  
    // Retrieve all Tutorials
    router.get("/", lista_canciones.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", lista_canciones.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", lista_canciones.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", lista_canciones.delete);
  
    // // Search por titulo Tutorials para el POSTMAN localhost:4000/api/lista_canciones/?searchTerm="list"
    router.get("/:searchTerm", lista_canciones.searchByTitle);
  
    app.use("/api/lista_canciones", router);
  };