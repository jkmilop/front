package co.usbcali.edu.ingesoft2.web.rest;

import co.usbcali.edu.ingesoft2.domain.Actividad;
import co.usbcali.edu.ingesoft2.repository.ActividadRepository;
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
 * REST controller for managing {@link co.usbcali.edu.ingesoft2.domain.Actividad}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActividadResource {

    private final Logger log = LoggerFactory.getLogger(ActividadResource.class);

    private static final String ENTITY_NAME = "actividad";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActividadRepository actividadRepository;

    public ActividadResource(ActividadRepository actividadRepository) {
        this.actividadRepository = actividadRepository;
    }

    /**
     * {@code POST  /actividads} : Create a new actividad.
     *
     * @param actividad the actividad to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new actividad, or with status {@code 400 (Bad Request)} if the actividad has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/actividads")
    public Mono<ResponseEntity<Actividad>> createActividad(@Valid @RequestBody Actividad actividad) throws URISyntaxException {
        log.debug("REST request to save Actividad : {}", actividad);
        if (actividad.getId() != null) {
            throw new BadRequestAlertException("A new actividad cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return actividadRepository
            .save(actividad)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/actividads/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /actividads/:id} : Updates an existing actividad.
     *
     * @param id the id of the actividad to save.
     * @param actividad the actividad to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actividad,
     * or with status {@code 400 (Bad Request)} if the actividad is not valid,
     * or with status {@code 500 (Internal Server Error)} if the actividad couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/actividads/{id}")
    public Mono<ResponseEntity<Actividad>> updateActividad(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Actividad actividad
    ) throws URISyntaxException {
        log.debug("REST request to update Actividad : {}, {}", id, actividad);
        if (actividad.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actividad.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return actividadRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return actividadRepository
                    .save(actividad)
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
     * {@code PATCH  /actividads/:id} : Partial updates given fields of an existing actividad, field will ignore if it is null
     *
     * @param id the id of the actividad to save.
     * @param actividad the actividad to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actividad,
     * or with status {@code 400 (Bad Request)} if the actividad is not valid,
     * or with status {@code 404 (Not Found)} if the actividad is not found,
     * or with status {@code 500 (Internal Server Error)} if the actividad couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/actividads/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Actividad>> partialUpdateActividad(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Actividad actividad
    ) throws URISyntaxException {
        log.debug("REST request to partial update Actividad partially : {}, {}", id, actividad);
        if (actividad.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actividad.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return actividadRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Actividad> result = actividadRepository
                    .findById(actividad.getId())
                    .map(existingActividad -> {
                        if (actividad.getNombre() != null) {
                            existingActividad.setNombre(actividad.getNombre());
                        }
                        if (actividad.getEstado() != null) {
                            existingActividad.setEstado(actividad.getEstado());
                        }

                        return existingActividad;
                    })
                    .flatMap(actividadRepository::save);

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
     * {@code GET  /actividads} : get all the actividads.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actividads in body.
     */
    @GetMapping("/actividads")
    public Mono<List<Actividad>> getAllActividads() {
        log.debug("REST request to get all Actividads");
        return actividadRepository.findAll().collectList();
    }

    /**
     * {@code GET  /actividads} : get all the actividads as a stream.
     * @return the {@link Flux} of actividads.
     */
    @GetMapping(value = "/actividads", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Actividad> getAllActividadsAsStream() {
        log.debug("REST request to get all Actividads as a stream");
        return actividadRepository.findAll();
    }

    /**
     * {@code GET  /actividads/:id} : get the "id" actividad.
     *
     * @param id the id of the actividad to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the actividad, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/actividads/{id}")
    public Mono<ResponseEntity<Actividad>> getActividad(@PathVariable Long id) {
        log.debug("REST request to get Actividad : {}", id);
        Mono<Actividad> actividad = actividadRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(actividad);
    }

    /**
     * {@code DELETE  /actividads/:id} : delete the "id" actividad.
     *
     * @param id the id of the actividad to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/actividads/{id}")
    public Mono<ResponseEntity<Void>> deleteActividad(@PathVariable Long id) {
        log.debug("REST request to delete Actividad : {}", id);
        return actividadRepository
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
