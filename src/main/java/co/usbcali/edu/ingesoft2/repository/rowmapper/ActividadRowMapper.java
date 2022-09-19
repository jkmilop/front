package co.usbcali.edu.ingesoft2.repository.rowmapper;

import co.usbcali.edu.ingesoft2.domain.Actividad;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Actividad}, with proper type conversions.
 */
@Service
public class ActividadRowMapper implements BiFunction<Row, String, Actividad> {

    private final ColumnConverter converter;

    public ActividadRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Actividad} stored in the database.
     */
    @Override
    public Actividad apply(Row row, String prefix) {
        Actividad entity = new Actividad();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNombre(converter.fromRow(row, prefix + "_nombre", String.class));
        entity.setEstado(converter.fromRow(row, prefix + "_estado", Boolean.class));
        entity.setCursoId(converter.fromRow(row, prefix + "_curso_id", Long.class));
        return entity;
    }
}
