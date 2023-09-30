const { Pool } = require('pg');

//configuracion para acceder a la base de datos
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '13033162',
    database: 'db_spotify_is',
    port: '5432'
});

//metodo para añadir una nueva cancion en la bd en una lista
//se pide en la cabecera: el id de la lista a la que pertenece la cancion, el nombre de la cancion,
//los colaboradores o artistas que contribuyeron al desarrollo de la cancion, y el path del link de la cancion que permitira reproducirla
exports.create = (req, res) => {
    const { id_lista, nombre_cancion, colaboradores, path_cancion } = req.body;
  
    const sql = 'INSERT INTO canciones (id_lista , nombre_cancion ,colaboradores ,path_cancion) VALUES ($1,$2,$3,$4)';
    const values = [id_lista, nombre_cancion, colaboradores, path_cancion];
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al crear Lista de Canciones: ' + err.message);
        res.status(500).json({ message: 'Error al crear Lista de Canciones' });
        return;
      }
      console.log('Cancion creado con éxito');
      res.status(201).json({ message: 'Lista de Canciones creado con éxito' });
    });
};

// Obtener todas las Canciones que hay en la bd, asociadas a la imagen de la lista de canciones a la que pertenecen
exports.findAll = (req, res) => {
    const sql = 'SELECT c.id_cancion,c.nombre_cancion,c.colaboradores,c.path_cancion,lc.pathimage FROM canciones c JOIN lista_canciones lc ON c.id_lista=lc.id_lista';
  
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error al obtener las Canciones: ' + err.message);
        res.status(500).json({ message: 'Error al obtener las Canciones' });
        return;
      }
      res.status(200).json(result.rows);
    });
};

// Obtener una sola cancion por su ID
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    const sql = 'SELECT * FROM canciones WHERE id_cancion = $1';
    const values = [id];
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al obtener la Cancion: ' + err.message);
        res.status(500).json({ message: 'Error al obtener la Cancion' });
        return;
      }
  
      if (result.rowCount === 1) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Cancion no encontrada con el ID ' + id });
      }
    });
};

// Actualizar una Cancion por su ID
exports.update = (req, res) => {
    const id = req.params.id;
    const { id_lista, nombre_cancion, colaboradores, path_cancion } = req.body;
  
    const sql = 'UPDATE canciones SET id_lista = $1, nombre_cancion = $2, colaboradores = $3, path_cancion = $4 WHERE id_cancion = $5';
    const values = [id_lista, nombre_cancion, colaboradores, path_cancion, id];
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al actualizar la Cancion: ' + err.message);
        res.status(500).json({ message: 'Error al actualizar la Cancion' });
        return;
      }
  
      if (result.rowCount === 1) {
        res.status(200).json({ message: 'Cancion actualizada con éxito' });
      } else {
        res.status(404).json({ message: `No se puede actualizar la Cancion con el ID ${id}. ¡Quizás no se encontró la Cancion o req.body está vacío!` });
      }
    });
};

// Eliminar una cancion por su ID
exports.delete = (req, res) => {
    const id = req.params.id;
  
    const sql = 'DELETE FROM canciones WHERE id_cancion = $1';
    const values = [id];
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al eliminar la Cancion: ' + err.message);
        res.status(500).json({ message: 'Error al eliminar la Lista de Canciones' });
        return;
      }
  
      if (result.rowCount === 1) {
        res.status(200).json({ message: 'Cancion eliminada con éxito' });
      } else {
        res.status(404).json({ message: `No se puede eliminar la Cancion con el ID ${id}. ¡Quizás no se encontró la Cancion!` });
      }
    });
};
  
  // Buscar cancion por nombre de cancion (LIKE)
exports.searchByName = (req, res) => {
    const searchTerm = req.query.searchTerm;
  
    if (!searchTerm) {
      res.status(400).json({ message: "El parámetro 'searchTerm' es requerido." });
      return;
    }
  
    const sql = 'SELECT * FROM canciones WHERE nombre_cancion ILIKE $1';
    const values = [`%${searchTerm}%`];
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al realizar la búsqueda por nombre_cancion: ' + err.message);
        res.status(500).json({ message: 'Error al realizar la búsqueda' });
        return;
      }
  
      res.status(200).json(result.rows);
    });
  };

