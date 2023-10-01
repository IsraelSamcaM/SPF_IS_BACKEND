module.exports = app => {
    const canciones = require("../controllers/cancion.controller.js");
  
    var router = require("express").Router();
  
   // router para añadir una cancion a una lista de canciones
    router.post("/", canciones.create);
  
    // router para encontrar todas las canciones
    router.get("/", canciones.findAll);
  
      // router para Obtener una sola cancion por su ID
    router.get("/:id", canciones.findOne);
  
    // router para actualizar una sola cancion por su ID
    router.put("/:id", canciones.update);
  
    // router para eliminar una sola cancion por su ID
    router.delete("/:id", canciones.delete);
  
    //localhost:4000/api/canciones/search/ ?searchTerm=cu 
    // router para buscar una sola cancion por su nombre de cancion
    router.get("/search/:searchTerm", canciones.searchByName);
  
    app.use("/api/canciones", router);
  };