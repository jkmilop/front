package co.usbcali.edu.ingesoft2.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Matricula.
 */
@Table("matricula")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Matricula implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Transient
    @JsonIgnoreProperties(value = { "matriculas", "calificacions" }, allowSetters = true)
    private Estudiante estudiante;

    @Transient
    @JsonIgnoreProperties(value = { "actividads", "matriculas", "profesor" }, allowSetters = true)
    private Curso curso;

    @Column("estudiante_id")
    private Long estudianteId;

    @Column("curso_id")
    private Long cursoId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Matricula id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Estudiante getEstudiante() {
        return this.estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
        this.estudianteId = estudiante != null ? estudiante.getId() : null;
    }

    public Matricula estudiante(Estudiante estudiante) {
        this.setEstudiante(estudiante);
        return this;
    }

    public Curso getCurso() {
        return this.curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
        this.cursoId = curso != null ? curso.getId() : null;
    }

    public Matricula curso(Curso curso) {
        this.setCurso(curso);
        return this;
    }

    public Long getEstudianteId() {
        return this.estudianteId;
    }

    public void setEstudianteId(Long estudiante) {
        this.estudianteId = estudiante;
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
        if (!(o instanceof Matricula)) {
            return false;
        }
        return id != null && id.equals(((Matricula) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Matricula{" +
            "id=" + getId() +
            "}";
    }
}
