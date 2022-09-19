package co.usbcali.edu.ingesoft2.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import co.usbcali.edu.ingesoft2.IntegrationTest;
import co.usbcali.edu.ingesoft2.domain.Profesor;
import co.usbcali.edu.ingesoft2.repository.EntityManager;
import co.usbcali.edu.ingesoft2.repository.ProfesorRepository;
import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link ProfesorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ProfesorResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_APELLIDO = "AAAAAAAAAA";
    private static final String UPDATED_APELLIDO = "BBBBBBBBBB";

    private static final String DEFAULT_CORREO = "AAAAAAAAAA";
    private static final String UPDATED_CORREO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/profesors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProfesorRepository profesorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Profesor profesor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Profesor createEntity(EntityManager em) {
        Profesor profesor = new Profesor().nombre(DEFAULT_NOMBRE).apellido(DEFAULT_APELLIDO).correo(DEFAULT_CORREO);
        return profesor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Profesor createUpdatedEntity(EntityManager em) {
        Profesor profesor = new Profesor().nombre(UPDATED_NOMBRE).apellido(UPDATED_APELLIDO).correo(UPDATED_CORREO);
        return profesor;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Profesor.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        profesor = createEntity(em);
    }

    @Test
    void createProfesor() throws Exception {
        int databaseSizeBeforeCreate = profesorRepository.findAll().collectList().block().size();
        // Create the Profesor
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeCreate + 1);
        Profesor testProfesor = profesorList.get(profesorList.size() - 1);
        assertThat(testProfesor.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testProfesor.getApellido()).isEqualTo(DEFAULT_APELLIDO);
        assertThat(testProfesor.getCorreo()).isEqualTo(DEFAULT_CORREO);
    }

    @Test
    void createProfesorWithExistingId() throws Exception {
        // Create the Profesor with an existing ID
        profesor.setId(1L);

        int databaseSizeBeforeCreate = profesorRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = profesorRepository.findAll().collectList().block().size();
        // set the field null
        profesor.setNombre(null);

        // Create the Profesor, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkApellidoIsRequired() throws Exception {
        int databaseSizeBeforeTest = profesorRepository.findAll().collectList().block().size();
        // set the field null
        profesor.setApellido(null);

        // Create the Profesor, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkCorreoIsRequired() throws Exception {
        int databaseSizeBeforeTest = profesorRepository.findAll().collectList().block().size();
        // set the field null
        profesor.setCorreo(null);

        // Create the Profesor, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllProfesorsAsStream() {
        // Initialize the database
        profesorRepository.save(profesor).block();

        List<Profesor> profesorList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Profesor.class)
            .getResponseBody()
            .filter(profesor::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(profesorList).isNotNull();
        assertThat(profesorList).hasSize(1);
        Profesor testProfesor = profesorList.get(0);
        assertThat(testProfesor.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testProfesor.getApellido()).isEqualTo(DEFAULT_APELLIDO);
        assertThat(testProfesor.getCorreo()).isEqualTo(DEFAULT_CORREO);
    }

    @Test
    void getAllProfesors() {
        // Initialize the database
        profesorRepository.save(profesor).block();

        // Get all the profesorList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(profesor.getId().intValue()))
            .jsonPath("$.[*].nombre")
            .value(hasItem(DEFAULT_NOMBRE))
            .jsonPath("$.[*].apellido")
            .value(hasItem(DEFAULT_APELLIDO))
            .jsonPath("$.[*].correo")
            .value(hasItem(DEFAULT_CORREO));
    }

    @Test
    void getProfesor() {
        // Initialize the database
        profesorRepository.save(profesor).block();

        // Get the profesor
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, profesor.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(profesor.getId().intValue()))
            .jsonPath("$.nombre")
            .value(is(DEFAULT_NOMBRE))
            .jsonPath("$.apellido")
            .value(is(DEFAULT_APELLIDO))
            .jsonPath("$.correo")
            .value(is(DEFAULT_CORREO));
    }

    @Test
    void getNonExistingProfesor() {
        // Get the profesor
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingProfesor() throws Exception {
        // Initialize the database
        profesorRepository.save(profesor).block();

        int databaseSizeBeforeUpdate = profesorRepository.findAll().collectList().block().size();

        // Update the profesor
        Profesor updatedProfesor = profesorRepository.findById(profesor.getId()).block();
        updatedProfesor.nombre(UPDATED_NOMBRE).apellido(UPDATED_APELLIDO).correo(UPDATED_CORREO);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedProfesor.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedProfesor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeUpdate);
        Profesor testProfesor = profesorList.get(profesorList.size() - 1);
        assertThat(testProfesor.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testProfesor.getApellido()).isEqualTo(UPDATED_APELLIDO);
        assertThat(testProfesor.getCorreo()).isEqualTo(UPDATED_CORREO);
    }

    @Test
    void putNonExistingProfesor() throws Exception {
        int databaseSizeBeforeUpdate = profesorRepository.findAll().collectList().block().size();
        profesor.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, profesor.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchProfesor() throws Exception {
        int databaseSizeBeforeUpdate = profesorRepository.findAll().collectList().block().size();
        profesor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamProfesor() throws Exception {
        int databaseSizeBeforeUpdate = profesorRepository.findAll().collectList().block().size();
        profesor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateProfesorWithPatch() throws Exception {
        // Initialize the database
        profesorRepository.save(profesor).block();

        int databaseSizeBeforeUpdate = profesorRepository.findAll().collectList().block().size();

        // Update the profesor using partial update
        Profesor partialUpdatedProfesor = new Profesor();
        partialUpdatedProfesor.setId(profesor.getId());

        partialUpdatedProfesor.nombre(UPDATED_NOMBRE).apellido(UPDATED_APELLIDO).correo(UPDATED_CORREO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedProfesor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedProfesor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeUpdate);
        Profesor testProfesor = profesorList.get(profesorList.size() - 1);
        assertThat(testProfesor.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testProfesor.getApellido()).isEqualTo(UPDATED_APELLIDO);
        assertThat(testProfesor.getCorreo()).isEqualTo(UPDATED_CORREO);
    }

    @Test
    void fullUpdateProfesorWithPatch() throws Exception {
        // Initialize the database
        profesorRepository.save(profesor).block();

        int databaseSizeBeforeUpdate = profesorRepository.findAll().collectList().block().size();

        // Update the profesor using partial update
        Profesor partialUpdatedProfesor = new Profesor();
        partialUpdatedProfesor.setId(profesor.getId());

        partialUpdatedProfesor.nombre(UPDATED_NOMBRE).apellido(UPDATED_APELLIDO).correo(UPDATED_CORREO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedProfesor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedProfesor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeUpdate);
        Profesor testProfesor = profesorList.get(profesorList.size() - 1);
        assertThat(testProfesor.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testProfesor.getApellido()).isEqualTo(UPDATED_APELLIDO);
        assertThat(testProfesor.getCorreo()).isEqualTo(UPDATED_CORREO);
    }

    @Test
    void patchNonExistingProfesor() throws Exception {
        int databaseSizeBeforeUpdate = profesorRepository.findAll().collectList().block().size();
        profesor.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, profesor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchProfesor() throws Exception {
        int databaseSizeBeforeUpdate = profesorRepository.findAll().collectList().block().size();
        profesor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamProfesor() throws Exception {
        int databaseSizeBeforeUpdate = profesorRepository.findAll().collectList().block().size();
        profesor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(profesor))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Profesor in the database
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteProfesor() {
        // Initialize the database
        profesorRepository.save(profesor).block();

        int databaseSizeBeforeDelete = profesorRepository.findAll().collectList().block().size();

        // Delete the profesor
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, profesor.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Profesor> profesorList = profesorRepository.findAll().collectList().block();
        assertThat(profesorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
