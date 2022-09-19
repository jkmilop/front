package co.usbcali.edu.ingesoft2.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import co.usbcali.edu.ingesoft2.IntegrationTest;
import co.usbcali.edu.ingesoft2.domain.Calificacion;
import co.usbcali.edu.ingesoft2.repository.CalificacionRepository;
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
 * Integration tests for the {@link CalificacionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class CalificacionResourceIT {

    private static final Double DEFAULT_NOTA = 1D;
    private static final Double UPDATED_NOTA = 2D;

    private static final String ENTITY_API_URL = "/api/calificacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CalificacionRepository calificacionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Calificacion calificacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Calificacion createEntity(EntityManager em) {
        Calificacion calificacion = new Calificacion().nota(DEFAULT_NOTA);
        return calificacion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Calificacion createUpdatedEntity(EntityManager em) {
        Calificacion calificacion = new Calificacion().nota(UPDATED_NOTA);
        return calificacion;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Calificacion.class).block();
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
        calificacion = createEntity(em);
    }

    @Test
    void createCalificacion() throws Exception {
        int databaseSizeBeforeCreate = calificacionRepository.findAll().collectList().block().size();
        // Create the Calificacion
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(calificacion))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeCreate + 1);
        Calificacion testCalificacion = calificacionList.get(calificacionList.size() - 1);
        assertThat(testCalificacion.getNota()).isEqualTo(DEFAULT_NOTA);
    }

    @Test
    void createCalificacionWithExistingId() throws Exception {
        // Create the Calificacion with an existing ID
        calificacion.setId(1L);

        int databaseSizeBeforeCreate = calificacionRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(calificacion))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNotaIsRequired() throws Exception {
        int databaseSizeBeforeTest = calificacionRepository.findAll().collectList().block().size();
        // set the field null
        calificacion.setNota(null);

        // Create the Calificacion, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(calificacion))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllCalificacionsAsStream() {
        // Initialize the database
        calificacionRepository.save(calificacion).block();

        List<Calificacion> calificacionList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Calificacion.class)
            .getResponseBody()
            .filter(calificacion::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(calificacionList).isNotNull();
        assertThat(calificacionList).hasSize(1);
        Calificacion testCalificacion = calificacionList.get(0);
        assertThat(testCalificacion.getNota()).isEqualTo(DEFAULT_NOTA);
    }

    @Test
    void getAllCalificacions() {
        // Initialize the database
        calificacionRepository.save(calificacion).block();

        // Get all the calificacionList
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
            .value(hasItem(calificacion.getId().intValue()))
            .jsonPath("$.[*].nota")
            .value(hasItem(DEFAULT_NOTA.doubleValue()));
    }

    @Test
    void getCalificacion() {
        // Initialize the database
        calificacionRepository.save(calificacion).block();

        // Get the calificacion
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, calificacion.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(calificacion.getId().intValue()))
            .jsonPath("$.nota")
            .value(is(DEFAULT_NOTA.doubleValue()));
    }

    @Test
    void getNonExistingCalificacion() {
        // Get the calificacion
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingCalificacion() throws Exception {
        // Initialize the database
        calificacionRepository.save(calificacion).block();

        int databaseSizeBeforeUpdate = calificacionRepository.findAll().collectList().block().size();

        // Update the calificacion
        Calificacion updatedCalificacion = calificacionRepository.findById(calificacion.getId()).block();
        updatedCalificacion.nota(UPDATED_NOTA);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedCalificacion.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedCalificacion))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeUpdate);
        Calificacion testCalificacion = calificacionList.get(calificacionList.size() - 1);
        assertThat(testCalificacion.getNota()).isEqualTo(UPDATED_NOTA);
    }

    @Test
    void putNonExistingCalificacion() throws Exception {
        int databaseSizeBeforeUpdate = calificacionRepository.findAll().collectList().block().size();
        calificacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, calificacion.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(calificacion))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCalificacion() throws Exception {
        int databaseSizeBeforeUpdate = calificacionRepository.findAll().collectList().block().size();
        calificacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(calificacion))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCalificacion() throws Exception {
        int databaseSizeBeforeUpdate = calificacionRepository.findAll().collectList().block().size();
        calificacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(calificacion))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCalificacionWithPatch() throws Exception {
        // Initialize the database
        calificacionRepository.save(calificacion).block();

        int databaseSizeBeforeUpdate = calificacionRepository.findAll().collectList().block().size();

        // Update the calificacion using partial update
        Calificacion partialUpdatedCalificacion = new Calificacion();
        partialUpdatedCalificacion.setId(calificacion.getId());

        partialUpdatedCalificacion.nota(UPDATED_NOTA);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCalificacion.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCalificacion))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeUpdate);
        Calificacion testCalificacion = calificacionList.get(calificacionList.size() - 1);
        assertThat(testCalificacion.getNota()).isEqualTo(UPDATED_NOTA);
    }

    @Test
    void fullUpdateCalificacionWithPatch() throws Exception {
        // Initialize the database
        calificacionRepository.save(calificacion).block();

        int databaseSizeBeforeUpdate = calificacionRepository.findAll().collectList().block().size();

        // Update the calificacion using partial update
        Calificacion partialUpdatedCalificacion = new Calificacion();
        partialUpdatedCalificacion.setId(calificacion.getId());

        partialUpdatedCalificacion.nota(UPDATED_NOTA);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCalificacion.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCalificacion))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeUpdate);
        Calificacion testCalificacion = calificacionList.get(calificacionList.size() - 1);
        assertThat(testCalificacion.getNota()).isEqualTo(UPDATED_NOTA);
    }

    @Test
    void patchNonExistingCalificacion() throws Exception {
        int databaseSizeBeforeUpdate = calificacionRepository.findAll().collectList().block().size();
        calificacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, calificacion.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(calificacion))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCalificacion() throws Exception {
        int databaseSizeBeforeUpdate = calificacionRepository.findAll().collectList().block().size();
        calificacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(calificacion))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCalificacion() throws Exception {
        int databaseSizeBeforeUpdate = calificacionRepository.findAll().collectList().block().size();
        calificacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(calificacion))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Calificacion in the database
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCalificacion() {
        // Initialize the database
        calificacionRepository.save(calificacion).block();

        int databaseSizeBeforeDelete = calificacionRepository.findAll().collectList().block().size();

        // Delete the calificacion
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, calificacion.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Calificacion> calificacionList = calificacionRepository.findAll().collectList().block();
        assertThat(calificacionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
