package co.usbcali.edu.ingesoft2.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.usbcali.edu.ingesoft2.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CalificacionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Calificacion.class);
        Calificacion calificacion1 = new Calificacion();
        calificacion1.setId(1L);
        Calificacion calificacion2 = new Calificacion();
        calificacion2.setId(calificacion1.getId());
        assertThat(calificacion1).isEqualTo(calificacion2);
        calificacion2.setId(2L);
        assertThat(calificacion1).isNotEqualTo(calificacion2);
        calificacion1.setId(null);
        assertThat(calificacion1).isNotEqualTo(calificacion2);
    }
}
