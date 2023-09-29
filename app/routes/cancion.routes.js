module.exports = app => {
    const canciones = require("../controllers/cancion.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", canciones.create);
  
    // Retrieve all Tutorials
    router.get("/", canciones.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", canciones.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", canciones.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", canciones.delete);
  
    // // Search por titulo Tutorials para el POSTMAN localhost:4000/api/lista_canciones/?searchTerm="list"
    router.get("/:searchTerm", canciones.searchByName);
  
    app.use("/api/canciones", router);
  };