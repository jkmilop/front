package co.usbcali.edu.ingesoft2.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import co.usbcali.edu.ingesoft2.domain.Calificacion;
import co.usbcali.edu.ingesoft2.repository.rowmapper.ActividadRowMapper;
import co.usbcali.edu.ingesoft2.repository.rowmapper.CalificacionRowMapper;
import co.usbcali.edu.ingesoft2.repository.rowmapper.EstudianteRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.function.BiFunction;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Comparison;
import org.springframework.data.relational.core.sql.Condition;
import org.springframework.data.relational.core.sql.Conditions;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoinCondition;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC custom repository implementation for the Calificacion entity.
 */
@SuppressWarnings("unused")
class CalificacionRepositoryInternalImpl extends SimpleR2dbcRepository<Calificacion, Long> implements CalificacionRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final ActividadRowMapper actividadMapper;
    private final EstudianteRowMapper estudianteMapper;
    private final CalificacionRowMapper calificacionMapper;

    private static final Table entityTable = Table.aliased("calificacion", EntityManager.ENTITY_ALIAS);
    private static final Table actividadTable = Table.aliased("actividad", "actividad");
    private static final Table estudianteTable = Table.aliased("estudiante", "estudiante");

    public CalificacionRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        ActividadRowMapper actividadMapper,
        EstudianteRowMapper estudianteMapper,
        CalificacionRowMapper calificacionMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Calificacion.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.actividadMapper = actividadMapper;
        this.estudianteMapper = estudianteMapper;
        this.calificacionMapper = calificacionMapper;
    }

    @Override
    public Flux<Calificacion> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Calificacion> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = CalificacionSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(ActividadSqlHelper.getColumns(actividadTable, "actividad"));
        columns.addAll(EstudianteSqlHelper.getColumns(estudianteTable, "estudiante"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(actividadTable)
            .on(Column.create("actividad_id", entityTable))
            .equals(Column.create("id", actividadTable))
            .leftOuterJoin(estudianteTable)
            .on(Column.create("estudiante_id", entityTable))
            .equals(Column.create("id", estudianteTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Calificacion.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Calificacion> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Calificacion> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Calificacion process(Row row, RowMetadata metadata) {
        Calificacion entity = calificacionMapper.apply(row, "e");
        entity.setActividad(actividadMapper.apply(row, "actividad"));
        entity.setEstudiante(estudianteMapper.apply(row, "estudiante"));
        return entity;
    }

    @Override
    public <S extends Calificacion> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
