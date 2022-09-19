package co.usbcali.edu.ingesoft2.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import co.usbcali.edu.ingesoft2.domain.Curso;
import co.usbcali.edu.ingesoft2.repository.rowmapper.CursoRowMapper;
import co.usbcali.edu.ingesoft2.repository.rowmapper.ProfesorRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the Curso entity.
 */
@SuppressWarnings("unused")
class CursoRepositoryInternalImpl extends SimpleR2dbcRepository<Curso, Long> implements CursoRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final ProfesorRowMapper profesorMapper;
    private final CursoRowMapper cursoMapper;

    private static final Table entityTable = Table.aliased("curso", EntityManager.ENTITY_ALIAS);
    private static final Table profesorTable = Table.aliased("profesor", "profesor");

    public CursoRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        ProfesorRowMapper profesorMapper,
        CursoRowMapper cursoMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Curso.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.profesorMapper = profesorMapper;
        this.cursoMapper = cursoMapper;
    }

    @Override
    public Flux<Curso> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Curso> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = CursoSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(ProfesorSqlHelper.getColumns(profesorTable, "profesor"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(profesorTable)
            .on(Column.create("profesor_id", entityTable))
            .equals(Column.create("id", profesorTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Curso.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Curso> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Curso> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Curso process(Row row, RowMetadata metadata) {
        Curso entity = cursoMapper.apply(row, "e");
        entity.setProfesor(profesorMapper.apply(row, "profesor"));
        return entity;
    }

    @Override
    public <S extends Curso> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
