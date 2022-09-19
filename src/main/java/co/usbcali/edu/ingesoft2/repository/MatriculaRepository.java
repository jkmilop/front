package co.usbcali.edu.ingesoft2.repository;

import co.usbcali.edu.ingesoft2.domain.Matricula;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Matricula entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatriculaRepository extends ReactiveCrudRepository<Matricula, Long>, MatriculaRepositoryInternal {
    @Query("SELECT * FROM matricula entity WHERE entity.estudiante_id = :id")
    Flux<Matricula> findByEstudiante(Long id);

    @Query("SELECT * FROM matricula entity WHERE entity.estudiante_id IS NULL")
    Flux<Matricula> findAllWhereEstudianteIsNull();

    @Query("SELECT * FROM matricula entity WHERE entity.curso_id = :id")
    Flux<Matricula> findByCurso(Long id);

    @Query("SELECT * FROM matricula entity WHERE entity.curso_id IS NULL")
    Flux<Matricula> findAllWhereCursoIsNull();

    @Override
    <S extends Matricula> Mono<S> save(S entity);

    @Override
    Flux<Matricula> findAll();

    @Override
    Mono<Matricula> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface MatriculaRepositoryInternal {
    <S extends Matricula> Mono<S> save(S entity);

    Flux<Matricula> findAllBy(Pageable pageable);

    Flux<Matricula> findAll();

    Mono<Matricula> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Matricula> findAllBy(Pageable pageable, Criteria criteria);

}
