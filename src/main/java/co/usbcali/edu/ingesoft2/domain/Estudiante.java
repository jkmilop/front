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
 * A Estudiante.
 */
@Table("estudiante")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Estudiante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("nombre")
    private String nombre;

    @NotNull(message = "must not be null")
    @Column("apellido")
    private String apellido;

    @NotNull(message = "must not be null")
    @Column("correo")
    private String correo;

    @Transient
    @JsonIgnoreProperties(value = { "estudiante", "curso" }, allowSetters = true)
    private Set<Matricula> matriculas = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(value = { "actividad", "estudiante" }, allowSetters = true)
    private Set<Calificacion> calificacions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Estudiante id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Estudiante nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return this.apellido;
    }

    public Estudiante apellido(String apellido) {
        this.setApellido(apellido);
        return this;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return this.correo;
    }

    public Estudiante correo(String correo) {
        this.setCorreo(correo);
        return this;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public Set<Matricula> getMatriculas() {
        return this.matriculas;
    }

    public void setMatriculas(Set<Matricula> matriculas) {
        if (this.matriculas != null) {
            this.matriculas.forEach(i -> i.setEstudiante(null));
        }
        if (matriculas != null) {
            matriculas.forEach(i -> i.setEstudiante(this));
        }
        this.matriculas = matriculas;
    }

    public Estudiante matriculas(Set<Matricula> matriculas) {
        this.setMatriculas(matriculas);
        return this;
    }

    public Estudiante addMatricula(Matricula matricula) {
        this.matriculas.add(matricula);
        matricula.setEstudiante(this);
        return this;
    }

    public Estudiante removeMatricula(Matricula matricula) {
        this.matriculas.remove(matricula);
        matricula.setEstudiante(null);
        return this;
    }

    public Set<Calificacion> getCalificacions() {
        return this.calificacions;
    }

    public void setCalificacions(Set<Calificacion> calificacions) {
        if (this.calificacions != null) {
            this.calificacions.forEach(i -> i.setEstudiante(null));
        }
        if (calificacions != null) {
            calificacions.forEach(i -> i.setEstudiante(this));
        }
        this.calificacions = calificacions;
    }

    public Estudiante calificacions(Set<Calificacion> calificacions) {
        this.setCalificacions(calificacions);
        return this;
    }

    public Estudiante addCalificacion(Calificacion calificacion) {
        this.calificacions.add(calificacion);
        calificacion.setEstudiante(this);
        return this;
    }

    public Estudiante removeCalificacion(Calificacion calificacion) {
        this.calificacions.remove(calificacion);
        calificacion.setEstudiante(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Estudiante)) {
            return false;
        }
        return id != null && id.equals(((Estudiante) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Estudiante{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", apellido='" + getApellido() + "'" +
            ", correo='" + getCorreo() + "'" +
            "}";
    }
}
