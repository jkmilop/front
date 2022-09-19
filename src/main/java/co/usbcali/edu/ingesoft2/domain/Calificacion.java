package co.usbcali.edu.ingesoft2.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Calificacion.
 */
@Table("calificacion")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Calificacion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("nota")
    private Double nota;

    @Transient
    @JsonIgnoreProperties(value = { "calificacions", "curso" }, allowSetters = true)
    private Actividad actividad;

    @Transient
    @JsonIgnoreProperties(value = { "matriculas", "calificacions" }, allowSetters = true)
    private Estudiante estudiante;

    @Column("actividad_id")
    private Long actividadId;

    @Column("estudiante_id")
    private Long estudianteId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Calificacion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getNota() {
        return this.nota;
    }

    public Calificacion nota(Double nota) {
        this.setNota(nota);
        return this;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }

    public Actividad getActividad() {
        return this.actividad;
    }

    public void setActividad(Actividad actividad) {
        this.actividad = actividad;
        this.actividadId = actividad != null ? actividad.getId() : null;
    }

    public Calificacion actividad(Actividad actividad) {
        this.setActividad(actividad);
        return this;
    }

    public Estudiante getEstudiante() {
        return this.estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
        this.estudianteId = estudiante != null ? estudiante.getId() : null;
    }

    public Calificacion estudiante(Estudiante estudiante) {
        this.setEstudiante(estudiante);
        return this;
    }

    public Long getActividadId() {
        return this.actividadId;
    }

    public void setActividadId(Long actividad) {
        this.actividadId = actividad;
    }

    public Long getEstudianteId() {
        return this.estudianteId;
    }

    public void setEstudianteId(Long estudiante) {
        this.estudianteId = estudiante;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Calificacion)) {
            return false;
        }
        return id != null && id.equals(((Calificacion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Calificacion{" +
            "id=" + getId() +
            ", nota=" + getNota() +
            "}";
    }
}
