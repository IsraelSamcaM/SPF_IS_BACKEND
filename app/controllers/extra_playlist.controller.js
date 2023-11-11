const pool = require('../config/config');


// Crear una nueva asignacion de cancion a una lista canciones
exports.create = (req, res) => {
    const { id_lista, id_cancion } = req.body;

    // Validación de entrada
    if (!id_lista || !id_cancion) {
        return res.status(400).json({ message: 'Se requieren id_lista e id_cancion.' });
    }

    const sql = 'INSERT INTO extra_playlist (id_lista, id_cancion) VALUES ($1, $2)';
    const values = [id_lista, id_cancion];

    pool.query(sql, values, (err, result) => {
        if (err) {
            // Manejo de errores
            if (err.code === '23505') { // Violación de clave única (ya existe la asignación)
                return res.status(409).json({ message: 'Esta canción ya está en la lista.' });
            }

            console.error('Error al crear un el registro para playlist: ' + err.message);
            return res.status(500).json({ message: 'Error al crear un el registro para playlist.' });
        }

        console.log('Añadido con éxito');
        res.status(201).json({ message: 'Canción añadida a la lista con éxito.' });
    });
};


exports.delete = (req, res) => {
    const { id_lista, id_cancion } = req.params;

    const sql = 'DELETE FROM extra_playlist WHERE id_lista = $1 AND id_cancion = $2';
    const values = [id_lista, id_cancion];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al eliminar la asignación de canción a lista: ' + err.message);
            res.status(500).json({ message: 'Error al eliminar la asignación de canción a lista.' });
            return;
        }

        if (result.rowCount === 1) {
            console.log('Eliminado con éxito');
            res.status(200).json({ message: 'Asignación eliminada con éxito.' });
        } else {
            console.log('No se encontró la asignación');
            res.status(404).json({ message: 'No se encontró la asignación con los IDs proporcionados.' });
        }
    });
};
