const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '13033162',
    database: 'db_spotify_is',
    port: '5432'
});


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
      console.log('Lista de Canciones creado con éxito');
      res.status(201).json({ message: 'Lista de Canciones creado con éxito' });
    });
};

// Obtener todas las Canciones
exports.findAll = (req, res) => {
    const sql = 'SELECT * FROM canciones';
  
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error al obtener las Canciones: ' + err.message);
        res.status(500).json({ message: 'Error al obtener las Canciones' });
        return;
      }
      res.status(200).json(result.rows);
    });
};

// Obtener una sola Lista de Canciones por su ID
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

// Actualizar una Canciones por su ID
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

// Eliminar una Lista de Canciones por su ID
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
  
  // Buscar Listas de Canciones por título_lista (LIKE)
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
