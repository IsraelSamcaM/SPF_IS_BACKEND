const pool = require('../config/config');


//metodo para crear una lista de canciones en la bd
//se pide en la cabecera: el titulo que llevara la lista, el tipo ya sea album o single,
//el estado, si es que esta oculto o publico, y el path de la imagen que se asiganara a la lista
exports.create = (req, res) => {
    const {  id_usuario, titulo_lista, path_image, colaborador } = req.body;
  
    const sql = 'INSERT INTO lista_canciones ( id_usuario, titulo_lista, path_image, colaborador, cantidad_canciones) VALUES ($1,$2,$3,$4)';
    const values = [ id_usuario, titulo_lista, path_image, colaborador];
  
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

exports.createlist= (req, res) => {
  const { nombre_usuario, titulo_lista, path_image, colaborador } = req.body;

  const sqlBuscarUsuario = 'SELECT ID_USUARIO FROM USUARIOS WHERE NOMBRE_USUARIO = $1';
  const valuesBuscarUsuario = [nombre_usuario];

  pool.query(sqlBuscarUsuario, valuesBuscarUsuario, (err, resultUsuario) => {
      if (err) {
          console.error('Error al buscar usuario: ' + err.message);
          res.status(500).json({ message: 'Error al buscar usuario' });
          return;
      }

      if (resultUsuario.rows.length === 0) {
          console.error('Usuario no encontrado');
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
      }

      const id_usuario = resultUsuario.rows[0].id_usuario;

      const sqlInsertarLista = 'INSERT INTO LISTA_CANCIONES (ID_USUARIO, TITULO_LISTA, PATH_IMAGE, COLABORADOR) VALUES ($1, $2, $3, $4, 0)';
      const valuesInsertarLista = [id_usuario, titulo_lista, path_image, colaborador];

      pool.query(sqlInsertarLista, valuesInsertarLista, (err, resultInsertarLista) => {
          if (err) {
              console.error('Error al crear Lista de Canciones: ' + err.message);
              res.status(500).json({ message: 'Error al crear Lista de Canciones' });
              return;
          }

          console.log('Lista de Canciones creado con éxito');
          res.status(201).json({ message: 'Lista de Canciones creado con éxito' });
      });
  });
};


// metodo para obtener todas las Listas de Canciones de la bd y sus atributos
exports.findAll = (req, res) => {
      //'SELECT * FROM lista_canciones lc JOIN usuarios u';
    const sql =`
    SELECT 
      lc.id_lista,
      u.id_usuario,
      lc.titulo_lista,
      lc.path_image,
      lc.colaborador,
      u.nombre_usuario,
      u.tipo_usuario,
      lc.cantidad_canciones
    FROM lista_canciones lc
    JOIN usuarios u ON lc.id_usuario = u.id_usuario 
    `;
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error al obtener las Listas de Canciones: ' + err.message);
        res.status(500).json({ message: 'Error al obtener las Listas de Canciones' });
        return;
      }
      res.status(200).json(result.rows);
    });
};

exports.findAllListasConCanciones = (req, res) => {
const sql =`
SELECT 
  lc.id_lista,
  u.id_usuario,
  lc.titulo_lista,
  lc.path_image,
  lc.colaborador,
  u.nombre_usuario,
  u.tipo_usuario,
  lc.cantidad_canciones
FROM lista_canciones lc
JOIN usuarios u ON lc.id_usuario = u.id_usuario 
WHERE cantidad_canciones != 0
`;
pool.query(sql, (err, result) => {
  if (err) {
    console.error('Error al obtener las Listas de Canciones: ' + err.message);
    res.status(500).json({ message: 'Error al obtener las Listas de Canciones' });
    return;
  }
  res.status(200).json(result.rows);
});
};

// Obtener todas la lista de Canciones si le das su id con sus Canciones asociadas y su artista
exports.findAllMusicId = (req, res) => {
  const id = req.params.id;
  const sql = `
  SELECT
    lc.id_lista,
    lc.titulo_lista,
    lc.path_image,
    lc.colaborador,
    lc.cantidad_canciones,
    COALESCE(json_agg(c.*) FILTER (WHERE c.id_cancion IS NOT NULL), '[]') AS canciones,
    COALESCE(json_agg(u.*) FILTER (WHERE u.id_usuario IS NOT NULL), '[]') AS artista
  FROM
    lista_canciones lc
  LEFT JOIN
    canciones c ON lc.id_lista = c.id_lista
  LEFT JOIN
    usuarios u ON lc.id_usuario = u.id_usuario
  WHERE lc.id_lista = $1
  GROUP BY
    lc.id_lista;
  `;
  const values = [id];

  pool.query(sql, values,(err, result) => {
    if (err) {
      console.error('Error al obtener las Listas de Canciones: ' + err.message);
      res.status(500).json({ message: 'Error al obtener las Listas de Canciones' });
      return;
    }
    
    // El resultado ya está en el formato deseado, no es necesario procesarlo más.
    res.status(200).json(result.rows);
  });
};

// Obtener todas las Listas de Canciones con sus Canciones asociadas
exports.findAllMusic = (req, res) => {
  const sql = `
      SELECT
      lc.id_lista,
      lc.titulo_lista,
      lc.path_image,
      lc.colaborador,
      lc.cantidad_canciones,
      COALESCE(json_agg(c.*) FILTER (WHERE c.id_cancion IS NOT NULL), '[]') AS canciones,
      COALESCE(json_agg(u.*) FILTER (WHERE u.id_usuario IS NOT NULL), '[]') AS artista
          FROM
          lista_canciones lc
      LEFT JOIN
          canciones c ON lc.id_lista = c.id_lista
      LEFT JOIN
          usuarios u ON lc.id_usuario = u.id_usuario -- Suponiendo que el campo ID_USUARIO en LISTA_CANCIONES es correcto
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
  // 'SELECT * FROM lista_canciones WHERE id_lista = $1';
    const sql =`
      SELECT 
      lc.id_lista,
      u.id_usuario,
      lc.titulo_lista,
      lc.path_image,
      lc.colaborador,
      lc.cantidad_canciones,
      u.nombre_usuario
      FROM lista_canciones lc
      JOIN usuarios u ON lc.id_usuario=u.id_usuario
      WHERE id_lista = $1
    `;
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
    const {  id_usuario, titulo_lista, path_image, colaborador } = req.body;
  
    const sql = 'UPDATE lista_canciones SET id_usuario = $1, titulo_lista = $2, path_image = $3, colaborador = $4 WHERE id_lista = $5';
    const values = [ id_usuario, titulo_lista, path_image, colaborador, id];
  
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

