const { Pool } = require('pg');

//configuracion para acceder a la base de datos
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '13033162',
    database: 'db_spotify_is',
    port: '5432'
});

//metodo para crear una lista de canciones en la bd
//se pide en la cabecera: el titulo que llevara la lista, el tipo ya sea album o single,
//el estado, si es que esta oculto o publico, y el path de la imagen que se asiganara a la lista
exports.create = (req, res) => {
    const { titulo_lista, tipo_lista, estado, pathimage } = req.body;
  
    const sql = 'INSERT INTO lista_canciones (titulo_lista, tipo_lista,estado,pathimage) VALUES ($1,$2,$3,$4)';
    const values = [titulo_lista, tipo_lista, estado, pathimage];
  
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

// metodo para obtener todas las Listas de Canciones de la bd y sus atributos
exports.findAll = (req, res) => {
    const sql = 'SELECT * FROM lista_canciones ';
  
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error al obtener las Listas de Canciones: ' + err.message);
        res.status(500).json({ message: 'Error al obtener las Listas de Canciones' });
        return;
      }
      res.status(200).json(result.rows);
    });
};

// SUJETO A SER PROBADO
// Obtener todas las Listas de Canciones con sus Canciones asociadas
exports.findAllMusic = (req, res) => {
  const sql = `
    SELECT
      lc.id_lista,
      lc.titulo_lista,
      lc.tipo_lista,
      lc.pathimage,
      lc.estado,
      COALESCE(json_agg(c.*) FILTER (WHERE c.id_cancion IS NOT NULL), '[]') AS canciones
    FROM
      lista_canciones lc
    LEFT JOIN
      canciones c ON lc.id_lista = c.id_lista
    GROUP BY
      lc.id_lista
  `;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener las Listas de Canciones: ' + err.message);
      res.status(500).json({ message: 'Error al obtener las Listas de Canciones' });
      return;
    }
    
    // El resultado ya está en el formato deseado, no es necesario procesarlo más.
    res.status(200).json(result.rows);
  });
};


// Obtener una sola Lista de Canciones por su ID
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    const sql = 'SELECT * FROM lista_canciones WHERE id_lista = $1';
    const values = [id];
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al obtener la Lista de Canciones: ' + err.message);
        res.status(500).json({ message: 'Error al obtener la Lista de Canciones' });
        return;
      }
  
      if (result.rowCount === 1) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Lista de Canciones no encontrada con el ID ' + id });
      }
    });
};

// Actualizar los parametros de una Lista de Canciones por su ID
exports.update = (req, res) => {
    const id = req.params.id;
    const { titulo_lista, tipo_lista, estado, pathimage } = req.body;
  
    const sql = 'UPDATE lista_canciones SET titulo_lista = $1, tipo_lista = $2, estado = $3, pathimage = $4 WHERE id_lista = $5';
    const values = [titulo_lista, tipo_lista, estado, pathimage, id];
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al actualizar la Lista de Canciones: ' + err.message);
        res.status(500).json({ message: 'Error al actualizar la Lista de Canciones' });
        return;
      }
  
      if (result.rowCount === 1) {
        res.status(200).json({ message: 'Lista de Canciones actualizada con éxito' });
      } else {
        res.status(404).json({ message: `No se puede actualizar la Lista de Canciones con el ID ${id}. ¡Quizás no se encontró la Lista de Canciones o req.body está vacío!` });
      }
    });
};

// Eliminar una Lista de Canciones por su ID
exports.delete = (req, res) => {
    const id = req.params.id;
  
    const sql = 'DELETE FROM lista_canciones WHERE id_lista = $1';
    const values = [id];
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al eliminar la Lista de Canciones: ' + err.message);
        res.status(500).json({ message: 'Error al eliminar la Lista de Canciones' });
        return;
      }
  
      if (result.rowCount === 1) {
        res.status(200).json({ message: 'Lista de Canciones eliminada con éxito' });
      } else {
        res.status(404).json({ message: `No se puede eliminar la Lista de Canciones con el ID ${id}. ¡Quizás no se encontró la Lista de Canciones!` });
      }
    });
};
  
  // Buscar Listas de Canciones por título_lista (LIKE)
exports.searchByTitle = (req, res) => {
    const searchTerm = req.query.searchTerm;
  
    if (!searchTerm) {
      res.status(400).json({ message: "El parámetro 'searchTerm' es requerido." });
      return;
    }
  
    const sql = 'SELECT * FROM lista_canciones WHERE titulo_lista ILIKE $1';
    const values = [`%${searchTerm}%`];
  
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al realizar la búsqueda por título_lista: ' + err.message);
        res.status(500).json({ message: 'Error al realizar la búsqueda' });
        return;
      }
  
      res.status(200).json(result.rows);
    });
  };

