package co.usbcali.edu.ingesoft2.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import co.usbcali.edu.ingesoft2.domain.Matricula;
import co.usbcali.edu.ingesoft2.repository.rowmapper.CursoRowMapper;
import co.usbcali.edu.ingesoft2.repository.rowmapper.EstudianteRowMapper;
import co.usbcali.edu.ingesoft2.repository.rowmapper.MatriculaRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the Matricula entity.
 */
@SuppressWarnings("unused")
class MatriculaRepositoryInternalImpl extends SimpleR2dbcRepository<Matricula, Long> implements MatriculaRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final EstudianteRowMapper estudianteMapper;
    private final CursoRowMapper cursoMapper;
    private final MatriculaRowMapper matriculaMapper;

    private static final Table entityTable = Table.aliased("matricula", EntityManager.ENTITY_ALIAS);
    private static final Table estudianteTable = Table.aliased("estudiante", "estudiante");
    private static final Table cursoTable = Table.aliased("curso", "curso");

    public MatriculaRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        EstudianteRowMapper estudianteMapper,
        CursoRowMapper cursoMapper,
        MatriculaRowMapper matriculaMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Matricula.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.estudianteMapper = estudianteMapper;
        this.cursoMapper = cursoMapper;
        this.matriculaMapper = matriculaMapper;
    }

    @Override
    public Flux<Matricula> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Matricula> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = MatriculaSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(EstudianteSqlHelper.getColumns(estudianteTable, "estudiante"));
        columns.addAll(CursoSqlHelper.getColumns(cursoTable, "curso"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(estudianteTable)
            .on(Column.create("estudiante_id", entityTable))
            .equals(Column.create("id", estudianteTable))
            .leftOuterJoin(cursoTable)
            .on(Column.create("curso_id", entityTable))
            .equals(Column.create("id", cursoTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Matricula.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Matricula> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Matricula> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Matricula process(Row row, RowMetadata metadata) {
        Matricula entity = matriculaMapper.apply(row, "e");
        entity.setEstudiante(estudianteMapper.apply(row, "estudiante"));
        entity.setCurso(cursoMapper.apply(row, "curso"));
        return entity;
    }

    @Override
    public <S extends Matricula> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
