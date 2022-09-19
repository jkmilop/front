package co.usbcali.edu.ingesoft2.repository.rowmapper;

import co.usbcali.edu.ingesoft2.domain.Matricula;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Matricula}, with proper type conversions.
 */
@Service
public class MatriculaRowMapper implements BiFunction<Row, String, Matricula> {

    private final ColumnConverter converter;

    public MatriculaRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Matricula} stored in the database.
     */
    @Override
    public Matricula apply(Row row, String prefix) {
        Matricula entity = new Matricula();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setEstudianteId(converter.fromRow(row, prefix + "_estudiante_id", Long.class));
        entity.setCursoId(converter.fromRow(row, prefix + "_curso_id", Long.class));
        return entity;
    }
}
