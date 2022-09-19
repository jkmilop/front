package co.usbcali.edu.ingesoft2.web.rest;

import co.usbcali.edu.ingesoft2.domain.Estudiante;
import co.usbcali.edu.ingesoft2.repository.EstudianteRepository;
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
 * REST controller for managing {@link co.usbcali.edu.ingesoft2.domain.Estudiante}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EstudianteResource {

    private final Logger log = LoggerFactory.getLogger(EstudianteResource.class);

    private static final String ENTITY_NAME = "estudiante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstudianteRepository estudianteRepository;

    public EstudianteResource(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    /**
     * {@code POST  /estudiantes} : Create a new estudiante.
     *
     * @param estudiante the estudiante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estudiante, or with status {@code 400 (Bad Request)} if the estudiante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/estudiantes")
    public Mono<ResponseEntity<Estudiante>> createEstudiante(@Valid @RequestBody Estudiante estudiante) throws URISyntaxException {
        log.debug("REST request to save Estudiante : {}", estudiante);
        if (estudiante.getId() != null) {
            throw new BadRequestAlertException("A new estudiante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return estudianteRepository
            .save(estudiante)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/estudiantes/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /estudiantes/:id} : Updates an existing estudiante.
     *
     * @param id the id of the estudiante to save.
     * @param estudiante the estudiante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estudiante,
     * or with status {@code 400 (Bad Request)} if the estudiante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estudiante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/estudiantes/{id}")
    public Mono<ResponseEntity<Estudiante>> updateEstudiante(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Estudiante estudiante
    ) throws URISyntaxException {
        log.debug("REST request to update Estudiante : {}, {}", id, estudiante);
        if (estudiante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estudiante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return estudianteRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return estudianteRepository
                    .save(estudiante)
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
     * {@code PATCH  /estudiantes/:id} : Partial updates given fields of an existing estudiante, field will ignore if it is null
     *
     * @param id the id of the estudiante to save.
     * @param estudiante the estudiante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estudiante,
     * or with status {@code 400 (Bad Request)} if the estudiante is not valid,
     * or with status {@code 404 (Not Found)} if the estudiante is not found,
     * or with status {@code 500 (Internal Server Error)} if the estudiante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/estudiantes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Estudiante>> partialUpdateEstudiante(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Estudiante estudiante
    ) throws URISyntaxException {
        log.debug("REST request to partial update Estudiante partially : {}, {}", id, estudiante);
        if (estudiante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estudiante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return estudianteRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Estudiante> result = estudianteRepository
                    .findById(estudiante.getId())
                    .map(existingEstudiante -> {
                        if (estudiante.getNombre() != null) {
                            existingEstudiante.setNombre(estudiante.getNombre());
                        }
                        if (estudiante.getApellido() != null) {
                            existingEstudiante.setApellido(estudiante.getApellido());
                        }
                        if (estudiante.getCorreo() != null) {
                            existingEstudiante.setCorreo(estudiante.getCorreo());
                        }

                        return existingEstudiante;
                    })
                    .flatMap(estudianteRepository::save);

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
     * {@code GET  /estudiantes} : get all the estudiantes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estudiantes in body.
     */
    @GetMapping("/estudiantes")
    public Mono<List<Estudiante>> getAllEstudiantes() {
        log.debug("REST request to get all Estudiantes");
        return estudianteRepository.findAll().collectList();
    }

    /**
     * {@code GET  /estudiantes} : get all the estudiantes as a stream.
     * @return the {@link Flux} of estudiantes.
     */
    @GetMapping(value = "/estudiantes", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Estudiante> getAllEstudiantesAsStream() {
        log.debug("REST request to get all Estudiantes as a stream");
        return estudianteRepository.findAll();
    }

    /**
     * {@code GET  /estudiantes/:id} : get the "id" estudiante.
     *
     * @param id the id of the estudiante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estudiante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/estudiantes/{id}")
    public Mono<ResponseEntity<Estudiante>> getEstudiante(@PathVariable Long id) {
        log.debug("REST request to get Estudiante : {}", id);
        Mono<Estudiante> estudiante = estudianteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(estudiante);
    }

    /**
     * {@code DELETE  /estudiantes/:id} : delete the "id" estudiante.
     *
     * @param id the id of the estudiante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/estudiantes/{id}")
    public Mono<ResponseEntity<Void>> deleteEstudiante(@PathVariable Long id) {
        log.debug("REST request to delete Estudiante : {}", id);
        return estudianteRepository
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
