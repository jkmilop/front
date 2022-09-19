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
 * A Curso.
 */
@Table("curso")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Curso implements Serializable {

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
    @JsonIgnoreProperties(value = { "calificacions", "curso" }, allowSetters = true)
    private Set<Actividad> actividads = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(value = { "estudiante", "curso" }, allowSetters = true)
    private Set<Matricula> matriculas = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(value = { "cursos" }, allowSetters = true)
    private Profesor profesor;

    @Column("profesor_id")
    private Long profesorId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Curso id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Curso nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Boolean getEstado() {
        return this.estado;
    }

    public Curso estado(Boolean estado) {
        this.setEstado(estado);
        return this;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public Set<Actividad> getActividads() {
        return this.actividads;
    }

    public void setActividads(Set<Actividad> actividads) {
        if (this.actividads != null) {
            this.actividads.forEach(i -> i.setCurso(null));
        }
        if (actividads != null) {
            actividads.forEach(i -> i.setCurso(this));
        }
        this.actividads = actividads;
    }

    public Curso actividads(Set<Actividad> actividads) {
        this.setActividads(actividads);
        return this;
    }

    public Curso addActividad(Actividad actividad) {
        this.actividads.add(actividad);
        actividad.setCurso(this);
        return this;
    }

    public Curso removeActividad(Actividad actividad) {
        this.actividads.remove(actividad);
        actividad.setCurso(null);
        return this;
    }

    public Set<Matricula> getMatriculas() {
        return this.matriculas;
    }

    public void setMatriculas(Set<Matricula> matriculas) {
        if (this.matriculas != null) {
            this.matriculas.forEach(i -> i.setCurso(null));
        }
        if (matriculas != null) {
            matriculas.forEach(i -> i.setCurso(this));
        }
        this.matriculas = matriculas;
    }

    public Curso matriculas(Set<Matricula> matriculas) {
        this.setMatriculas(matriculas);
        return this;
    }

    public Curso addMatricula(Matricula matricula) {
        this.matriculas.add(matricula);
        matricula.setCurso(this);
        return this;
    }

    public Curso removeMatricula(Matricula matricula) {
        this.matriculas.remove(matricula);
        matricula.setCurso(null);
        return this;
    }

    public Profesor getProfesor() {
        return this.profesor;
    }

    public void setProfesor(Profesor profesor) {
        this.profesor = profesor;
        this.profesorId = profesor != null ? profesor.getId() : null;
    }

    public Curso profesor(Profesor profesor) {
        this.setProfesor(profesor);
        return this;
    }

    public Long getProfesorId() {
        return this.profesorId;
    }

    public void setProfesorId(Long profesor) {
        this.profesorId = profesor;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Curso)) {
            return false;
        }
        return id != null && id.equals(((Curso) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Curso{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", estado='" + getEstado() + "'" +
            "}";
    }
}
