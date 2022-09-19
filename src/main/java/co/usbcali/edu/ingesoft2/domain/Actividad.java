package co.usbcali.edu.ingesoft2.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Actividad.
 */
@Table("actividad")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Actividad implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("nombre")
    private String nombre;

    @NotNull(message = "must not be null")
    @Column("estado")
    private Boolean estado;

    @Transient
    @JsonIgnoreProperties(value = { "actividad", "estudiante" }, allowSetters = true)
    private Set<Calificacion> calificacions = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(value = { "actividads", "matriculas", "profesor" }, allowSetters = true)
    private Curso curso;

    @Column("curso_id")
    private Long cursoId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Actividad id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Actividad nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Boolean getEstado() {
        return this.estado;
    }

    public Actividad estado(Boolean estado) {
        this.setEstado(estado);
        return this;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public Set<Calificacion> getCalificacions() {
        return this.calificacions;
    }

    public void setCalificacions(Set<Calificacion> calificacions) {
        if (this.calificacions != null) {
            this.calificacions.forEach(i -> i.setActividad(null));
        }
        if (calificacions != null) {
            calificacions.forEach(i -> i.setActividad(this));
        }
        this.calificacions = calificacions;
    }

    public Actividad calificacions(Set<Calificacion> calificacions) {
        this.setCalificacions(calificacions);
        return this;
    }

    public Actividad addCalificacion(Calificacion calificacion) {
        this.calificacions.add(calificacion);
        calificacion.setActividad(this);
        return this;
    }

    public Actividad removeCalificacion(Calificacion calificacion) {
        this.calificacions.remove(calificacion);
        calificacion.setActividad(null);
        return this;
    }

    public Curso getCurso() {
        return this.curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
        this.cursoId = curso != null ? curso.getId() : null;
    }

    public Actividad curso(Curso curso) {
        this.setCurso(curso);
        return this;
    }

    public Long getCursoId() {
        return this.cursoId;
    }

    public void setCursoId(Long curso) {
        this.cursoId = curso;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Actividad)) {
            return false;
        }
        return id != null && id.equals(((Actividad) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Actividad{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", estado='" + getEstado() + "'" +
            "}";
    }
}
