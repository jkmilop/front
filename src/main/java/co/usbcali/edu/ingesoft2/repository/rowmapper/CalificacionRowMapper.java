package co.usbcali.edu.ingesoft2.repository.rowmapper;

import co.usbcali.edu.ingesoft2.domain.Calificacion;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Calificacion}, with proper type conversions.
 */
@Service
public class CalificacionRowMapper implements BiFunction<Row, String, Calificacion> {

    private final ColumnConverter converter;

    public CalificacionRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Calificacion} stored in the database.
     */
    @Override
    public Calificacion apply(Row row, String prefix) {
        Calificacion entity = new Calificacion();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNota(converter.fromRow(row, prefix + "_nota", Double.class));
        entity.setActividadId(converter.fromRow(row, prefix + "_actividad_id", Long.class));
        entity.setEstudianteId(converter.fromRow(row, prefix + "_estudiante_id", Long.class));
        return entity;
    }
}
