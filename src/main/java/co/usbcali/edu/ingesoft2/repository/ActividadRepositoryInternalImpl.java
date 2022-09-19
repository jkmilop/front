package co.usbcali.edu.ingesoft2.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import co.usbcali.edu.ingesoft2.domain.Actividad;
import co.usbcali.edu.ingesoft2.repository.rowmapper.ActividadRowMapper;
import co.usbcali.edu.ingesoft2.repository.rowmapper.CursoRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the Actividad entity.
 */
@SuppressWarnings("unused")
class ActividadRepositoryInternalImpl extends SimpleR2dbcRepository<Actividad, Long> implements ActividadRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final CursoRowMapper cursoMapper;
    private final ActividadRowMapper actividadMapper;

    private static final Table entityTable = Table.aliased("actividad", EntityManager.ENTITY_ALIAS);
    private static final Table cursoTable = Table.aliased("curso", "curso");

    public ActividadRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        CursoRowMapper cursoMapper,
        ActividadRowMapper actividadMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Actividad.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.cursoMapper = cursoMapper;
        this.actividadMapper = actividadMapper;
    }

    @Override
    public Flux<Actividad> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Actividad> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = ActividadSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(CursoSqlHelper.getColumns(cursoTable, "curso"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(cursoTable)
            .on(Column.create("curso_id", entityTable))
            .equals(Column.create("id", cursoTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Actividad.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Actividad> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Actividad> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Actividad process(Row row, RowMetadata metadata) {
        Actividad entity = actividadMapper.apply(row, "e");
        entity.setCurso(cursoMapper.apply(row, "curso"));
        return entity;
    }

    @Override
    public <S extends Actividad> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
