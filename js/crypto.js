import CryptoBase from './crypto-base.js';

export default class Crypto extends CryptoBase {
    constructor(id, nombre, simbolo, fechaCreacion, precioActual, consenso, cantidadCirculacion, algoritmo, sitioWeb) {
        super(id, nombre, simbolo, fechaCreacion, precioActual);
        this.consenso = consenso;
        this.cantidadCirculacion = cantidadCirculacion;
        this.algoritmo = algoritmo;
        this.sitioWeb = sitioWeb;
    }

    static validarConsenso(consenso) {
        if (!consenso || consenso.trim().length === 0) {
            throw new Error('El consenso no debe estar vacío.');
        }
    }

    static validarCantidadCirculacion(cantidadCirculacion) {
        if (isNaN(cantidadCirculacion) || cantidadCirculacion <= 0) {
            throw new Error('La cantidad de circulación debe ser un número positivo.');
        }
    }

    static validarAlgoritmo(algoritmo) {
        if (!algoritmo || algoritmo.trim().length === 0) {
            throw new Error('El algoritmo no debe estar vacío.');
        }
    }

    static validarSitioWeb(sitioWeb) {
        if (!sitioWeb || sitioWeb.trim().length === 0) {
            throw new Error('El sitio web no debe estar vacío.');
        }
    }

    verify() {
        const superResult = super.verify();

        if (!superResult.success) {
            return superResult;
        }

        try {
            Crypto.validarConsenso(this.consenso);
            Crypto.validarCantidadCirculacion(this.cantidadCirculacion);
            Crypto.validarAlgoritmo(this.algoritmo);
            Crypto.validarSitioWeb(this.sitioWeb);

            return { success: true };
        } catch (error) {
            return { success: false, rta: error.message };
        }
    }
}
