package co.usbcali.edu.ingesoft2.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import co.usbcali.edu.ingesoft2.IntegrationTest;
import co.usbcali.edu.ingesoft2.domain.Curso;
import co.usbcali.edu.ingesoft2.repository.CursoRepository;
import co.usbcali.edu.ingesoft2.repository.EntityManager;
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
 * Integration tests for the {@link CursoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class CursoResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ESTADO = false;
    private static final Boolean UPDATED_ESTADO = true;

    private static final String ENTITY_API_URL = "/api/cursos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Curso curso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Curso createEntity(EntityManager em) {
        Curso curso = new Curso().nombre(DEFAULT_NOMBRE).estado(DEFAULT_ESTADO);
        return curso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Curso createUpdatedEntity(EntityManager em) {
        Curso curso = new Curso().nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO);
        return curso;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Curso.class).block();
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
        curso = createEntity(em);
    }

    @Test
    void createCurso() throws Exception {
        int databaseSizeBeforeCreate = cursoRepository.findAll().collectList().block().size();
        // Create the Curso
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeCreate + 1);
        Curso testCurso = cursoList.get(cursoList.size() - 1);
        assertThat(testCurso.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testCurso.getEstado()).isEqualTo(DEFAULT_ESTADO);
    }

    @Test
    void createCursoWithExistingId() throws Exception {
        // Create the Curso with an existing ID
        curso.setId(1L);

        int databaseSizeBeforeCreate = cursoRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = cursoRepository.findAll().collectList().block().size();
        // set the field null
        curso.setNombre(null);

        // Create the Curso, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkEstadoIsRequired() throws Exception {
        int databaseSizeBeforeTest = cursoRepository.findAll().collectList().block().size();
        // set the field null
        curso.setEstado(null);

        // Create the Curso, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllCursosAsStream() {
        // Initialize the database
        cursoRepository.save(curso).block();

        List<Curso> cursoList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Curso.class)
            .getResponseBody()
            .filter(curso::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(cursoList).isNotNull();
        assertThat(cursoList).hasSize(1);
        Curso testCurso = cursoList.get(0);
        assertThat(testCurso.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testCurso.getEstado()).isEqualTo(DEFAULT_ESTADO);
    }

    @Test
    void getAllCursos() {
        // Initialize the database
        cursoRepository.save(curso).block();

        // Get all the cursoList
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
            .value(hasItem(curso.getId().intValue()))
            .jsonPath("$.[*].nombre")
            .value(hasItem(DEFAULT_NOMBRE))
            .jsonPath("$.[*].estado")
            .value(hasItem(DEFAULT_ESTADO.booleanValue()));
    }

    @Test
    void getCurso() {
        // Initialize the database
        cursoRepository.save(curso).block();

        // Get the curso
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, curso.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(curso.getId().intValue()))
            .jsonPath("$.nombre")
            .value(is(DEFAULT_NOMBRE))
            .jsonPath("$.estado")
            .value(is(DEFAULT_ESTADO.booleanValue()));
    }

    @Test
    void getNonExistingCurso() {
        // Get the curso
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingCurso() throws Exception {
        // Initialize the database
        cursoRepository.save(curso).block();

        int databaseSizeBeforeUpdate = cursoRepository.findAll().collectList().block().size();

        // Update the curso
        Curso updatedCurso = cursoRepository.findById(curso.getId()).block();
        updatedCurso.nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedCurso.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedCurso))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
        Curso testCurso = cursoList.get(cursoList.size() - 1);
        assertThat(testCurso.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testCurso.getEstado()).isEqualTo(UPDATED_ESTADO);
    }

    @Test
    void putNonExistingCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().collectList().block().size();
        curso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, curso.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().collectList().block().size();
        curso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().collectList().block().size();
        curso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCursoWithPatch() throws Exception {
        // Initialize the database
        cursoRepository.save(curso).block();

        int databaseSizeBeforeUpdate = cursoRepository.findAll().collectList().block().size();

        // Update the curso using partial update
        Curso partialUpdatedCurso = new Curso();
        partialUpdatedCurso.setId(curso.getId());

        partialUpdatedCurso.nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCurso.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCurso))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
        Curso testCurso = cursoList.get(cursoList.size() - 1);
        assertThat(testCurso.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testCurso.getEstado()).isEqualTo(UPDATED_ESTADO);
    }

    @Test
    void fullUpdateCursoWithPatch() throws Exception {
        // Initialize the database
        cursoRepository.save(curso).block();

        int databaseSizeBeforeUpdate = cursoRepository.findAll().collectList().block().size();

        // Update the curso using partial update
        Curso partialUpdatedCurso = new Curso();
        partialUpdatedCurso.setId(curso.getId());

        partialUpdatedCurso.nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCurso.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCurso))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
        Curso testCurso = cursoList.get(cursoList.size() - 1);
        assertThat(testCurso.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testCurso.getEstado()).isEqualTo(UPDATED_ESTADO);
    }

    @Test
    void patchNonExistingCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().collectList().block().size();
        curso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, curso.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().collectList().block().size();
        curso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().collectList().block().size();
        curso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(curso))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCurso() {
        // Initialize the database
        cursoRepository.save(curso).block();

        int databaseSizeBeforeDelete = cursoRepository.findAll().collectList().block().size();

        // Delete the curso
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, curso.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Curso> cursoList = cursoRepository.findAll().collectList().block();
        assertThat(cursoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
