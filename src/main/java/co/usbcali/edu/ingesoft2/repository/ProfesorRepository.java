package co.usbcali.edu.ingesoft2.repository;

import co.usbcali.edu.ingesoft2.domain.Profesor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Profesor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProfesorRepository extends ReactiveCrudRepository<Profesor, Long>, ProfesorRepositoryInternal {
    @Override
    <S extends Profesor> Mono<S> save(S entity);

    @Override
    Flux<Profesor> findAll();

    @Override
    Mono<Profesor> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ProfesorRepositoryInternal {
    <S extends Profesor> Mono<S> save(S entity);

    Flux<Profesor> findAllBy(Pageable pageable);

    Flux<Profesor> findAll();

    Mono<Profesor> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Profesor> findAllBy(Pageable pageable, Criteria criteria);

}
