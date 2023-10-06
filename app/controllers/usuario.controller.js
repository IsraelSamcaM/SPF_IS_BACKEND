const pool = require('../config/config');

// Crear un nuevo usuario
exports.create = (req, res) => {
    const { nombre_usuario, correo_usuario, contrasenia_usuario, tipo_usuario, fecha_nacimiento } = req.body;

    const sql = 'INSERT INTO usuarios (nombre_usuario, correo_usuario, contrasenia_usuario, tipo_usuario, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5)';
    const values = [nombre_usuario, correo_usuario, contrasenia_usuario, tipo_usuario, fecha_nacimiento];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al crear un usuario: ' + err.message);
            res.status(500).json({ message: 'Error al crear un usuario' });
            return;
        }
        console.log('Usuario creado con éxito');
        res.status(201).json({ message: 'Usuario creado con éxito' });
    });
};

// Obtener todos los usuarios
exports.findAll = (req, res) => {
    const sql = 'SELECT * FROM usuarios';

    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener los usuarios: ' + err.message);
            res.status(500).json({ message: 'Error al obtener los usuarios' });
            return;
        }
        res.status(200).json(result.rows);
    });
};

// Obtener un solo usuario por su ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM usuarios WHERE id_usuario = $1';
    const values = [id];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al obtener el usuario: ' + err.message);
            res.status(500).json({ message: 'Error al obtener el usuario' });
            return;
        }

        if (result.rowCount === 1) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado con el ID ' + id });
        }
    });
};

// Actualizar un usuario por su ID
exports.update = (req, res) => {
    const id = req.params.id;
    const { nombre_usuario, correo_usuario, contrasenia_usuario, tipo_usuario, fecha_nacimiento } = req.body;

    const sql = 'UPDATE usuarios SET nombre_usuario = $1, correo_usuario = $2, contrasenia_usuario = $3, tipo_usuario = $4, fecha_nacimiento = $5 WHERE id_usuario = $6';
    const values = [nombre_usuario, correo_usuario, contrasenia_usuario, tipo_usuario, fecha_nacimiento, id];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar el usuario: ' + err.message);
            res.status(500).json({ message: 'Error al actualizar el usuario' });
            return;
        }

        if (result.rowCount === 1) {
            res.status(200).json({ message: 'Usuario actualizado con éxito' });
        } else {
            res.status(404).json({ message: `No se puede actualizar el usuario con el ID ${id}. ¡Quizás no se encontró el usuario o req.body está vacío!` });
        }
    });
};

// Eliminar un usuario por su ID
exports.delete = (req, res) => {
        const id = req.params.id;

        const sql = 'DELETE FROM usuarios WHERE id_usuario = $1';
        const values = [id];

        pool.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error al eliminar el usuario: ' + err.message);
                res.status(500).json({ message: 'Error al eliminar el usuario' });
                return;
            }

            if (result.rowCount === 1) {
                res.status(200).json({ message: 'Usuario eliminado con éxito' });
            } else {
                res.status(404).json({ message: `No se puede eliminar el usuario con el ID ${id}. ¡Quizás no se encontró el usuario!` });
            }
    });
};

// Buscar usuario por nombre de usuario (LIKE)
exports.searchByName = (req, res) => {
    const searchTerm = req.query.searchTerm;

    if (!searchTerm) {
        res.status(400).json({ message: "El parámetro 'searchTerm' es requerido." });
        return;
    }
    console.log("Valor de searchTerm:", searchTerm);

    const sql = 'SELECT * FROM usuarios WHERE nombre_usuario ILIKE $1';
    const values = [`%${searchTerm}%`];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al realizar la búsqueda por nombre_usuario: ' + err.message);
            res.status(500).json({ message: 'Error al realizar la búsqueda' });
            return;
        }

        res.status(200).json(result.rows);
    });
};

// Buscar usuario por nombre de usuario 
exports.searchByNameNoLike= (req, res) => {
    const searchTerm = req.query.searchTerm;

    if (!searchTerm) {
        res.status(400).json({ message: "El parámetro 'searchTerm' es requerido." });
        return;
    }
    console.log("Valor de searchTerm:", searchTerm);

    const sql = 'SELECT * FROM usuarios WHERE nombre_usuario  = $1';
    const values = [searchTerm];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al realizar la búsqueda por nombre_usuario: ' + err.message);
            res.status(500).json({ message: 'Error al realizar la búsqueda' });
            return;
        }

        res.status(200).json(result.rows);
    });
};

// Dado un id_user devolver todas las canciones que tiene ese user

exports.findCancionesByUser = (req, res) => {
    const id = req.params.id;
    const sql = `
    SELECT 
        c.id_cancion,
        c.nombre_cancion, 
        c.genero, 
        c.duracion,
        c.path_cancion,
        lc.id_lista,
        lc.titulo_lista,
        lc.path_image,
        u.id_usuario,
        u.nombre_usuario
    FROM public.usuarios u
        JOIN public.lista_canciones lc ON u.id_usuario = lc.id_usuario
        JOIN public.canciones c ON lc.id_lista = c.id_lista
    WHERE u.id_usuario = $1;
    `;
    const values = [id];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al obtener los usuarios: ' + err.message);
            res.status(500).json({ message: 'Error al obtener los usuarios' });
            return;
        }
        res.status(200).json(result.rows);
    });
};

// Dado un id_user devolver todas su listas.
exports.findListasByUser = (req, res) => {
    const id = req.params.id;

    const sql =`
    SELECT 
        u.id_usuario,
        u.nombre_usuario,
        lc.id_lista,
        lc.titulo_lista,
        lc.path_image,
        lc.cantidad_canciones
    FROM public.usuarios u
    JOIN public.lista_canciones lc ON u.id_usuario = lc.id_usuario
    WHERE u.id_usuario = $1;
    `;
    const values = [id];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario: ' + err.message);
            res.status(500).json({ message: 'Error al eliminar el usuario' });
            return;
        }

        if (result.rowCount === 1) {
            res.status(200).json({ message: 'Usuario eliminado con éxito' });
        } else {
            res.status(404).json({ message: `No se puede eliminar el usuario con el ID ${id}. ¡Quizás no se encontró el usuario!` });
        }
    });
};