package co.usbcali.edu.ingesoft2.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class CalificacionSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("nota", table, columnPrefix + "_nota"));

        columns.add(Column.aliased("actividad_id", table, columnPrefix + "_actividad_id"));
        columns.add(Column.aliased("estudiante_id", table, columnPrefix + "_estudiante_id"));
        return columns;
    }
}
