package co.usbcali.edu.ingesoft2.repository;

import co.usbcali.edu.ingesoft2.domain.Curso;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Curso entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CursoRepository extends ReactiveCrudRepository<Curso, Long>, CursoRepositoryInternal {
    @Query("SELECT * FROM curso entity WHERE entity.profesor_id = :id")
    Flux<Curso> findByProfesor(Long id);

    @Query("SELECT * FROM curso entity WHERE entity.profesor_id IS NULL")
    Flux<Curso> findAllWhereProfesorIsNull();

    @Override
    <S extends Curso> Mono<S> save(S entity);

    @Override
    Flux<Curso> findAll();

    @Override
    Mono<Curso> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface CursoRepositoryInternal {
    <S extends Curso> Mono<S> save(S entity);

    Flux<Curso> findAllBy(Pageable pageable);

    Flux<Curso> findAll();

    Mono<Curso> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Curso> findAllBy(Pageable pageable, Criteria criteria);

}
