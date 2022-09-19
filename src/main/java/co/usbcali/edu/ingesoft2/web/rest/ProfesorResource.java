package co.usbcali.edu.ingesoft2.web.rest;

import co.usbcali.edu.ingesoft2.domain.Profesor;
import co.usbcali.edu.ingesoft2.repository.ProfesorRepository;
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
 * REST controller for managing {@link co.usbcali.edu.ingesoft2.domain.Profesor}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProfesorResource {

    private final Logger log = LoggerFactory.getLogger(ProfesorResource.class);

    private static final String ENTITY_NAME = "profesor";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProfesorRepository profesorRepository;

    public ProfesorResource(ProfesorRepository profesorRepository) {
        this.profesorRepository = profesorRepository;
    }

    /**
     * {@code POST  /profesors} : Create a new profesor.
     *
     * @param profesor the profesor to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new profesor, or with status {@code 400 (Bad Request)} if the profesor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/profesors")
    public Mono<ResponseEntity<Profesor>> createProfesor(@Valid @RequestBody Profesor profesor) throws URISyntaxException {
        log.debug("REST request to save Profesor : {}", profesor);
        if (profesor.getId() != null) {
            throw new BadRequestAlertException("A new profesor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return profesorRepository
            .save(profesor)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/profesors/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /profesors/:id} : Updates an existing profesor.
     *
     * @param id the id of the profesor to save.
     * @param profesor the profesor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profesor,
     * or with status {@code 400 (Bad Request)} if the profesor is not valid,
     * or with status {@code 500 (Internal Server Error)} if the profesor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/profesors/{id}")
    public Mono<ResponseEntity<Profesor>> updateProfesor(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Profesor profesor
    ) throws URISyntaxException {
        log.debug("REST request to update Profesor : {}, {}", id, profesor);
        if (profesor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profesor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return profesorRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return profesorRepository
                    .save(profesor)
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
     * {@code PATCH  /profesors/:id} : Partial updates given fields of an existing profesor, field will ignore if it is null
     *
     * @param id the id of the profesor to save.
     * @param profesor the profesor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profesor,
     * or with status {@code 400 (Bad Request)} if the profesor is not valid,
     * or with status {@code 404 (Not Found)} if the profesor is not found,
     * or with status {@code 500 (Internal Server Error)} if the profesor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/profesors/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Profesor>> partialUpdateProfesor(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Profesor profesor
    ) throws URISyntaxException {
        log.debug("REST request to partial update Profesor partially : {}, {}", id, profesor);
        if (profesor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profesor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return profesorRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Profesor> result = profesorRepository
                    .findById(profesor.getId())
                    .map(existingProfesor -> {
                        if (profesor.getNombre() != null) {
                            existingProfesor.setNombre(profesor.getNombre());
                        }
                        if (profesor.getApellido() != null) {
                            existingProfesor.setApellido(profesor.getApellido());
                        }
                        if (profesor.getCorreo() != null) {
                            existingProfesor.setCorreo(profesor.getCorreo());
                        }

                        return existingProfesor;
                    })
                    .flatMap(profesorRepository::save);

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
     * {@code GET  /profesors} : get all the profesors.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of profesors in body.
     */
    @GetMapping("/profesors")
    public Mono<List<Profesor>> getAllProfesors() {
        log.debug("REST request to get all Profesors");
        return profesorRepository.findAll().collectList();
    }

    /**
     * {@code GET  /profesors} : get all the profesors as a stream.
     * @return the {@link Flux} of profesors.
     */
    @GetMapping(value = "/profesors", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Profesor> getAllProfesorsAsStream() {
        log.debug("REST request to get all Profesors as a stream");
        return profesorRepository.findAll();
    }

    /**
     * {@code GET  /profesors/:id} : get the "id" profesor.
     *
     * @param id the id of the profesor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the profesor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/profesors/{id}")
    public Mono<ResponseEntity<Profesor>> getProfesor(@PathVariable Long id) {
        log.debug("REST request to get Profesor : {}", id);
        Mono<Profesor> profesor = profesorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(profesor);
    }

    /**
     * {@code DELETE  /profesors/:id} : delete the "id" profesor.
     *
     * @param id the id of the profesor to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/profesors/{id}")
    public Mono<ResponseEntity<Void>> deleteProfesor(@PathVariable Long id) {
        log.debug("REST request to delete Profesor : {}", id);
        return profesorRepository
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
