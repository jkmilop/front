package co.usbcali.edu.ingesoft2.web.rest;

import co.usbcali.edu.ingesoft2.domain.Calificacion;
import co.usbcali.edu.ingesoft2.repository.CalificacionRepository;
import co.usbcali.edu.ingesoft2.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link co.usbcali.edu.ingesoft2.domain.Calificacion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CalificacionResource {

    private final Logger log = LoggerFactory.getLogger(CalificacionResource.class);

    private static final String ENTITY_NAME = "calificacion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CalificacionRepository calificacionRepository;

    public CalificacionResource(CalificacionRepository calificacionRepository) {
        this.calificacionRepository = calificacionRepository;
    }

    /**
     * {@code POST  /calificacions} : Create a new calificacion.
     *
     * @param calificacion the calificacion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new calificacion, or with status {@code 400 (Bad Request)} if the calificacion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/calificacions")
    public Mono<ResponseEntity<Calificacion>> createCalificacion(@Valid @RequestBody Calificacion calificacion) throws URISyntaxException {
        log.debug("REST request to save Calificacion : {}", calificacion);
        if (calificacion.getId() != null) {
            throw new BadRequestAlertException("A new calificacion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return calificacionRepository
            .save(calificacion)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/calificacions/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /calificacions/:id} : Updates an existing calificacion.
     *
     * @param id the id of the calificacion to save.
     * @param calificacion the calificacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated calificacion,
     * or with status {@code 400 (Bad Request)} if the calificacion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the calificacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/calificacions/{id}")
    public Mono<ResponseEntity<Calificacion>> updateCalificacion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Calificacion calificacion
    ) throws URISyntaxException {
        log.debug("REST request to update Calificacion : {}, {}", id, calificacion);
        if (calificacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, calificacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return calificacionRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return calificacionRepository
                    .save(calificacion)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /calificacions/:id} : Partial updates given fields of an existing calificacion, field will ignore if it is null
     *
     * @param id the id of the calificacion to save.
     * @param calificacion the calificacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated calificacion,
     * or with status {@code 400 (Bad Request)} if the calificacion is not valid,
     * or with status {@code 404 (Not Found)} if the calificacion is not found,
     * or with status {@code 500 (Internal Server Error)} if the calificacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/calificacions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Calificacion>> partialUpdateCalificacion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Calificacion calificacion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Calificacion partially : {}, {}", id, calificacion);
        if (calificacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, calificacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return calificacionRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Calificacion> result = calificacionRepository
                    .findById(calificacion.getId())
                    .map(existingCalificacion -> {
                        if (calificacion.getNota() != null) {
                            existingCalificacion.setNota(calificacion.getNota());
                        }

                        return existingCalificacion;
                    })
                    .flatMap(calificacionRepository::save);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, res.getId().toString()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /calificacions} : get all the calificacions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of calificacions in body.
     */
    @GetMapping("/calificacions")
    public Mono<List<Calificacion>> getAllCalificacions() {
        log.debug("REST request to get all Calificacions");
        return calificacionRepository.findAll().collectList();
    }

    /**
     * {@code GET  /calificacions} : get all the calificacions as a stream.
     * @return the {@link Flux} of calificacions.
     */
    @GetMapping(value = "/calificacions", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Calificacion> getAllCalificacionsAsStream() {
        log.debug("REST request to get all Calificacions as a stream");
        return calificacionRepository.findAll();
    }

    /**
     * {@code GET  /calificacions/:id} : get the "id" calificacion.
     *
     * @param id the id of the calificacion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the calificacion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/calificacions/{id}")
    public Mono<ResponseEntity<Calificacion>> getCalificacion(@PathVariable Long id) {
        log.debug("REST request to get Calificacion : {}", id);
        Mono<Calificacion> calificacion = calificacionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(calificacion);
    }

    /**
     * {@code DELETE  /calificacions/:id} : delete the "id" calificacion.
     *
     * @param id the id of the calificacion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/calificacions/{id}")
    public Mono<ResponseEntity<Void>> deleteCalificacion(@PathVariable Long id) {
        log.debug("REST request to delete Calificacion : {}", id);
        return calificacionRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity
                        .noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
                        .build()
                )
            );
    }
}
