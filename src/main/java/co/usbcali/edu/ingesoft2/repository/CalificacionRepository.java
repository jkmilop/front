package co.usbcali.edu.ingesoft2.repository;

import co.usbcali.edu.ingesoft2.domain.Calificacion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Calificacion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CalificacionRepository extends ReactiveCrudRepository<Calificacion, Long>, CalificacionRepositoryInternal {
    @Query("SELECT * FROM calificacion entity WHERE entity.actividad_id = :id")
    Flux<Calificacion> findByActividad(Long id);

    @Query("SELECT * FROM calificacion entity WHERE entity.actividad_id IS NULL")
    Flux<Calificacion> findAllWhereActividadIsNull();

    @Query("SELECT * FROM calificacion entity WHERE entity.estudiante_id = :id")
    Flux<Calificacion> findByEstudiante(Long id);

    @Query("SELECT * FROM calificacion entity WHERE entity.estudiante_id IS NULL")
    Flux<Calificacion> findAllWhereEstudianteIsNull();

    @Override
    <S extends Calificacion> Mono<S> save(S entity);

    @Override
    Flux<Calificacion> findAll();

    @Override
    Mono<Calificacion> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface CalificacionRepositoryInternal {
    <S extends Calificacion> Mono<S> save(S entity);

    Flux<Calificacion> findAllBy(Pageable pageable);

    Flux<Calificacion> findAll();

    Mono<Calificacion> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Calificacion> findAllBy(Pageable pageable, Criteria criteria);

}
