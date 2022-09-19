package co.usbcali.edu.ingesoft2.repository;

import co.usbcali.edu.ingesoft2.domain.Actividad;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Actividad entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActividadRepository extends ReactiveCrudRepository<Actividad, Long>, ActividadRepositoryInternal {
    @Query("SELECT * FROM actividad entity WHERE entity.curso_id = :id")
    Flux<Actividad> findByCurso(Long id);

    @Query("SELECT * FROM actividad entity WHERE entity.curso_id IS NULL")
    Flux<Actividad> findAllWhereCursoIsNull();

    @Override
    <S extends Actividad> Mono<S> save(S entity);

    @Override
    Flux<Actividad> findAll();

    @Override
    Mono<Actividad> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ActividadRepositoryInternal {
    <S extends Actividad> Mono<S> save(S entity);

    Flux<Actividad> findAllBy(Pageable pageable);

    Flux<Actividad> findAll();

    Mono<Actividad> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Actividad> findAllBy(Pageable pageable, Criteria criteria);

}
