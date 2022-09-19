package co.usbcali.edu.ingesoft2.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import co.usbcali.edu.ingesoft2.IntegrationTest;
import co.usbcali.edu.ingesoft2.domain.Actividad;
import co.usbcali.edu.ingesoft2.repository.ActividadRepository;
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
 * Integration tests for the {@link ActividadResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ActividadResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ESTADO = false;
    private static final Boolean UPDATED_ESTADO = true;

    private static final String ENTITY_API_URL = "/api/actividads";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Actividad actividad;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Actividad createEntity(EntityManager em) {
        Actividad actividad = new Actividad().nombre(DEFAULT_NOMBRE).estado(DEFAULT_ESTADO);
        return actividad;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Actividad createUpdatedEntity(EntityManager em) {
        Actividad actividad = new Actividad().nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO);
        return actividad;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Actividad.class).block();
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
        actividad = createEntity(em);
    }

    @Test
    void createActividad() throws Exception {
        int databaseSizeBeforeCreate = actividadRepository.findAll().collectList().block().size();
        // Create the Actividad
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeCreate + 1);
        Actividad testActividad = actividadList.get(actividadList.size() - 1);
        assertThat(testActividad.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testActividad.getEstado()).isEqualTo(DEFAULT_ESTADO);
    }

    @Test
    void createActividadWithExistingId() throws Exception {
        // Create the Actividad with an existing ID
        actividad.setId(1L);

        int databaseSizeBeforeCreate = actividadRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = actividadRepository.findAll().collectList().block().size();
        // set the field null
        actividad.setNombre(null);

        // Create the Actividad, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkEstadoIsRequired() throws Exception {
        int databaseSizeBeforeTest = actividadRepository.findAll().collectList().block().size();
        // set the field null
        actividad.setEstado(null);

        // Create the Actividad, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllActividadsAsStream() {
        // Initialize the database
        actividadRepository.save(actividad).block();

        List<Actividad> actividadList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Actividad.class)
            .getResponseBody()
            .filter(actividad::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(actividadList).isNotNull();
        assertThat(actividadList).hasSize(1);
        Actividad testActividad = actividadList.get(0);
        assertThat(testActividad.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testActividad.getEstado()).isEqualTo(DEFAULT_ESTADO);
    }

    @Test
    void getAllActividads() {
        // Initialize the database
        actividadRepository.save(actividad).block();

        // Get all the actividadList
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
            .value(hasItem(actividad.getId().intValue()))
            .jsonPath("$.[*].nombre")
            .value(hasItem(DEFAULT_NOMBRE))
            .jsonPath("$.[*].estado")
            .value(hasItem(DEFAULT_ESTADO.booleanValue()));
    }

    @Test
    void getActividad() {
        // Initialize the database
        actividadRepository.save(actividad).block();

        // Get the actividad
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, actividad.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(actividad.getId().intValue()))
            .jsonPath("$.nombre")
            .value(is(DEFAULT_NOMBRE))
            .jsonPath("$.estado")
            .value(is(DEFAULT_ESTADO.booleanValue()));
    }

    @Test
    void getNonExistingActividad() {
        // Get the actividad
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingActividad() throws Exception {
        // Initialize the database
        actividadRepository.save(actividad).block();

        int databaseSizeBeforeUpdate = actividadRepository.findAll().collectList().block().size();

        // Update the actividad
        Actividad updatedActividad = actividadRepository.findById(actividad.getId()).block();
        updatedActividad.nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedActividad.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedActividad))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeUpdate);
        Actividad testActividad = actividadList.get(actividadList.size() - 1);
        assertThat(testActividad.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testActividad.getEstado()).isEqualTo(UPDATED_ESTADO);
    }

    @Test
    void putNonExistingActividad() throws Exception {
        int databaseSizeBeforeUpdate = actividadRepository.findAll().collectList().block().size();
        actividad.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, actividad.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchActividad() throws Exception {
        int databaseSizeBeforeUpdate = actividadRepository.findAll().collectList().block().size();
        actividad.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamActividad() throws Exception {
        int databaseSizeBeforeUpdate = actividadRepository.findAll().collectList().block().size();
        actividad.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateActividadWithPatch() throws Exception {
        // Initialize the database
        actividadRepository.save(actividad).block();

        int databaseSizeBeforeUpdate = actividadRepository.findAll().collectList().block().size();

        // Update the actividad using partial update
        Actividad partialUpdatedActividad = new Actividad();
        partialUpdatedActividad.setId(actividad.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedActividad.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedActividad))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeUpdate);
        Actividad testActividad = actividadList.get(actividadList.size() - 1);
        assertThat(testActividad.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testActividad.getEstado()).isEqualTo(DEFAULT_ESTADO);
    }

    @Test
    void fullUpdateActividadWithPatch() throws Exception {
        // Initialize the database
        actividadRepository.save(actividad).block();

        int databaseSizeBeforeUpdate = actividadRepository.findAll().collectList().block().size();

        // Update the actividad using partial update
        Actividad partialUpdatedActividad = new Actividad();
        partialUpdatedActividad.setId(actividad.getId());

        partialUpdatedActividad.nombre(UPDATED_NOMBRE).estado(UPDATED_ESTADO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedActividad.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedActividad))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeUpdate);
        Actividad testActividad = actividadList.get(actividadList.size() - 1);
        assertThat(testActividad.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testActividad.getEstado()).isEqualTo(UPDATED_ESTADO);
    }

    @Test
    void patchNonExistingActividad() throws Exception {
        int databaseSizeBeforeUpdate = actividadRepository.findAll().collectList().block().size();
        actividad.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, actividad.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchActividad() throws Exception {
        int databaseSizeBeforeUpdate = actividadRepository.findAll().collectList().block().size();
        actividad.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamActividad() throws Exception {
        int databaseSizeBeforeUpdate = actividadRepository.findAll().collectList().block().size();
        actividad.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(actividad))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Actividad in the database
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteActividad() {
        // Initialize the database
        actividadRepository.save(actividad).block();

        int databaseSizeBeforeDelete = actividadRepository.findAll().collectList().block().size();

        // Delete the actividad
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, actividad.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Actividad> actividadList = actividadRepository.findAll().collectList().block();
        assertThat(actividadList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
