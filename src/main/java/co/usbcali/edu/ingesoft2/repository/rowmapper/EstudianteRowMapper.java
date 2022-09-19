package co.usbcali.edu.ingesoft2.repository.rowmapper;

import co.usbcali.edu.ingesoft2.domain.Estudiante;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Estudiante}, with proper type conversions.
 */
@Service
public class EstudianteRowMapper implements BiFunction<Row, String, Estudiante> {

    private final ColumnConverter converter;

    public EstudianteRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Estudiante} stored in the database.
     */
    @Override
    public Estudiante apply(Row row, String prefix) {
        Estudiante entity = new Estudiante();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNombre(converter.fromRow(row, prefix + "_nombre", String.class));
        entity.setApellido(converter.fromRow(row, prefix + "_apellido", String.class));
        entity.setCorreo(converter.fromRow(row, prefix + "_correo", String.class));
        return entity;
    }
}
