package co.usbcali.edu.ingesoft2.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import co.usbcali.edu.ingesoft2.IntegrationTest;
import co.usbcali.edu.ingesoft2.domain.Matricula;
import co.usbcali.edu.ingesoft2.repository.EntityManager;
import co.usbcali.edu.ingesoft2.repository.MatriculaRepository;
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
 * Integration tests for the {@link MatriculaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class MatriculaResourceIT {

    private static final String ENTITY_API_URL = "/api/matriculas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Matricula matricula;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matricula createEntity(EntityManager em) {
        Matricula matricula = new Matricula();
        return matricula;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matricula createUpdatedEntity(EntityManager em) {
        Matricula matricula = new Matricula();
        return matricula;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Matricula.class).block();
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
        matricula = createEntity(em);
    }

    @Test
    void createMatricula() throws Exception {
        int databaseSizeBeforeCreate = matriculaRepository.findAll().collectList().block().size();
        // Create the Matricula
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(matricula))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeCreate + 1);
        Matricula testMatricula = matriculaList.get(matriculaList.size() - 1);
    }

    @Test
    void createMatriculaWithExistingId() throws Exception {
        // Create the Matricula with an existing ID
        matricula.setId(1L);

        int databaseSizeBeforeCreate = matriculaRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(matricula))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllMatriculasAsStream() {
        // Initialize the database
        matriculaRepository.save(matricula).block();

        List<Matricula> matriculaList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Matricula.class)
            .getResponseBody()
            .filter(matricula::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(matriculaList).isNotNull();
        assertThat(matriculaList).hasSize(1);
        Matricula testMatricula = matriculaList.get(0);
    }

    @Test
    void getAllMatriculas() {
        // Initialize the database
        matriculaRepository.save(matricula).block();

        // Get all the matriculaList
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
            .value(hasItem(matricula.getId().intValue()));
    }

    @Test
    void getMatricula() {
        // Initialize the database
        matriculaRepository.save(matricula).block();

        // Get the matricula
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, matricula.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(matricula.getId().intValue()));
    }

    @Test
    void getNonExistingMatricula() {
        // Get the matricula
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingMatricula() throws Exception {
        // Initialize the database
        matriculaRepository.save(matricula).block();

        int databaseSizeBeforeUpdate = matriculaRepository.findAll().collectList().block().size();

        // Update the matricula
        Matricula updatedMatricula = matriculaRepository.findById(matricula.getId()).block();

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedMatricula.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedMatricula))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
        Matricula testMatricula = matriculaList.get(matriculaList.size() - 1);
    }

    @Test
    void putNonExistingMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().collectList().block().size();
        matricula.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, matricula.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(matricula))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().collectList().block().size();
        matricula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(matricula))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().collectList().block().size();
        matricula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(matricula))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateMatriculaWithPatch() throws Exception {
        // Initialize the database
        matriculaRepository.save(matricula).block();

        int databaseSizeBeforeUpdate = matriculaRepository.findAll().collectList().block().size();

        // Update the matricula using partial update
        Matricula partialUpdatedMatricula = new Matricula();
        partialUpdatedMatricula.setId(matricula.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedMatricula.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedMatricula))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
        Matricula testMatricula = matriculaList.get(matriculaList.size() - 1);
    }

    @Test
    void fullUpdateMatriculaWithPatch() throws Exception {
        // Initialize the database
        matriculaRepository.save(matricula).block();

        int databaseSizeBeforeUpdate = matriculaRepository.findAll().collectList().block().size();

        // Update the matricula using partial update
        Matricula partialUpdatedMatricula = new Matricula();
        partialUpdatedMatricula.setId(matricula.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedMatricula.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedMatricula))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
        Matricula testMatricula = matriculaList.get(matriculaList.size() - 1);
    }

    @Test
    void patchNonExistingMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().collectList().block().size();
        matricula.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, matricula.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(matricula))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().collectList().block().size();
        matricula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(matricula))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().collectList().block().size();
        matricula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(matricula))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteMatricula() {
        // Initialize the database
        matriculaRepository.save(matricula).block();

        int databaseSizeBeforeDelete = matriculaRepository.findAll().collectList().block().size();

        // Delete the matricula
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, matricula.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Matricula> matriculaList = matriculaRepository.findAll().collectList().block();
        assertThat(matriculaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
