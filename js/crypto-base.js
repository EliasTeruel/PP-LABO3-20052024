export default class CryptoBase {
    constructor(id, nombre, simbolo, fechaCreacion, precioActual) {
        this.id = id;
        this.nombre = nombre;
        this.simbolo = simbolo;
        this.fechaCreacion = fechaCreacion;
        this.precioActual = precioActual;
    }

    static validarNombre(nombre) {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error('El nombre no debe estar vacío.');
        }
    }

    static validarSimbolo(simbolo) {
        if (!simbolo || simbolo.trim().length === 0) {
            throw new Error('El símbolo no debe estar vacío.');
        }
    }

    static validarFechaCreacion(fechaCreacion) {
        if (!fechaCreacion) {
            throw new Error('La fecha de creación no debe estar vacía.');
        }
    }

    static validarPrecioActual(precioActual) {
        if (isNaN(precioActual) || precioActual <= 0) {
            throw new Error('El precio actual debe ser un número positivo.');
        }
    }

    verify() {
        try {
            CryptoBase.validarNombre(this.nombre);
            CryptoBase.validarSimbolo(this.simbolo);
            CryptoBase.validarFechaCreacion(this.fechaCreacion);
            CryptoBase.validarPrecioActual(this.precioActual);

            return { success: true };
        } catch (error) {
            return { success: false, rta: error.message };
        }
    }
}