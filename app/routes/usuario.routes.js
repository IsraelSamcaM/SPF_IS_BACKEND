module.exports = app => {
    const usuarios = require("../controllers/usuario.controller.js");
  
    var router = require("express").Router();
  
   // router para añadir una cancion a una lista de canciones
    router.post("/", usuarios.create);
  
    // router para encontrar todas las canciones
    router.get("/", usuarios.findAll);
  
      // router para Obtener una sola cancion por su ID
    router.get("/:id", usuarios.findOne);
  
    // router para actualizar una sola cancion por su ID
    router.put("/:id", usuarios.update);
  
    // router para eliminar una sola cancion por su ID
    router.delete("/:id", usuarios.delete);
    
    //localhost:4000/api/usuarios/search/?searchTerm=go
    // router para buscar una sola cancion por su nombre de cancion usando like 
    router.get("/search/:searchTerm", usuarios.searchByName);
    
    // router para buscar una sola cancion por su nombre de cancion 
    router.get("/search_nom/:searchTerm", usuarios.searchByNameNoLike);
  
    app.use("/api/usuarios", router);
  };