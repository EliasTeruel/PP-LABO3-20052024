import { leer, escribir, jsonToObject, objectToJson, limpiar } from "./local-storage.js";
//import CryptoBase from './crypto-base.js';
import Crypto from './crypto.js';
import { mostrarSpinner, mostrarSpinnerLoad, ocultarSpinner, ocultarSpinnerLoad } from "./spinner.js";

const KEY_STORAGE = "crypto";
const items = [];
const formulario = document.getElementById("form-item");

document.addEventListener('DOMContentLoaded', function () {
    loadItems();
    escuchandoFormulario();
    escuchandoBtnDeleteAll();
    masAcciones();
    cancelar();
});

async function loadItems() {
    mostrarSpinner();
    let str = await leer(KEY_STORAGE);
    ocultarSpinner();
    const objetos = jsonToObject(str) || [];

    objetos.forEach(obj => {
        const model = new Crypto(
            obj.id,
            obj.nombre,
            obj.simbolo,
            obj.fechaCreacion,
            obj.precioActual,
            obj.consenso,
            obj.cantidadCirculacion,
            obj.algoritmo,
            obj.sitioWeb
        );
        items.push(model);
    });
    rellenarTabla();
}

function rellenarTabla() {
    const tabla = document.getElementById("table-items");
    let tbody = tabla.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    const celdas = ["id", "nombre", "simbolo", "fechaCreacion", "precioActual", "consenso", "cantidadCirculacion", "algoritmo", "sitioWeb"];

    items.forEach((item) => {
        let nuevaFila = document.createElement("tr");
        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            nuevaCelda.textContent = item[celda];
            nuevaFila.appendChild(nuevaCelda);
        });
        nuevaFila.addEventListener('click', () => {
            actualizarFormulario(item);
        });
        tbody.appendChild(nuevaFila);
    });
}


function escuchandoFormulario() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        mostrarSpinnerLoad();
        const id = formulario.querySelector("#id").value;
        const nombre = formulario.querySelector("#nombre").value;
        const simbolo = formulario.querySelector("#simbolo").value;
        const fechaCreacion = new Date().toISOString().slice(0, 10);
        const precioActual = formulario.querySelector("#precio").value;
        const consenso = formulario.querySelector("#tipo-de-concenso").value;
        const cantidadCirculacion = formulario.querySelector("#cantidad-de-circulacion").value;
        const algoritmo = formulario.querySelector("#algoritmo").value;
        const sitioWeb = formulario.querySelector("#sitio-web-oficial").value;


        const model = new Crypto(
            id || generarNuevoId(),
            nombre,
            simbolo,
            fechaCreacion,
            precioActual,
            consenso,
            cantidadCirculacion,
            algoritmo,
            sitioWeb
        );
        const respuesta = model.verify();

        if (respuesta.success) {
            if (id) {
                const index = items.findIndex(item => item.id == id);
                if (index !== -1) {
                    items[index] = model;
                }
            } else {
                items.push(model);
            }
            const str = objectToJson(items);
            try {
                await escribir(KEY_STORAGE, str);
                actualizarFormulario();
                rellenarTabla();
            } catch (error) {
                alert(error);
            }
        } else {
            alert(respuesta.rta);
        }
        ocultarSpinnerLoad();
    });
}


function generarNuevoId() {
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    return maxId + 1;
}


function cancelar() {
    const btn = document.getElementById("btn-cancelar");
    btn.addEventListener("click", async (e) => {
        actualizarFormulario();
    });
}


function escuchandoBtnDeleteAll() {
    const btn = document.getElementById("btn-delete-all");
    btn.addEventListener("click", async (e) => {
        const rta = confirm('Desea eliminar todos los Items?');
        if (rta) {
            items.splice(0, items.length);
            try {
                await limpiar(KEY_STORAGE);
                actualizarFormulario();
                rellenarTabla();
            }
            catch (error) {
                alert(error);
            }
        }
    });
}


function actualizarFormulario(model = null) {
    const form = document.getElementById("form-item");
    if (model) {
        console.log("model: " + model.tipo);
        form.querySelector("#id").value = model.id;
        form.querySelector("#nombre").value = model.nombre;
        form.querySelector("#simbolo").value = model.simbolo;
        form.querySelector("#precio").value = model.precioActual;
        form.querySelector("#tipo-de-concenso").value = model.consenso;
        form.querySelector("#cantidad-de-circulacion").value = model.cantidadCirculacion;
        form.querySelector("#algoritmo").value = model.algoritmo;
        form.querySelector("#sitio-web-oficial").value = model.sitioWeb;
    } else {
        form.reset();
    }
}


function eliminarPorId(id) {
    const index = items.findIndex(item => item.id == id);
    console.log(index);
    if (index !== -1) {
        items.splice(index, 1);
        const str = objectToJson(items);
        escribir(KEY_STORAGE, str);
    }
}


function buscarPorId(id) {
    return items.find(item => item.id == id);
}


function masAcciones() {
    const btnMasAcciones = document.getElementById('btn-mas-acciones');
    const modal = document.getElementById('modal');
    btnMasAcciones.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    document.getElementById('btn-modificar').addEventListener('click', function () {
        const id = document.getElementById("ID").value;
        const item = buscarPorId(id);
        console.log(item);
        if (item) {
            actualizarFormulario(item);
        } else {
            alert("No se encontró ningún elemento con el ID proporcionado.");
        }
    });

    document.getElementById('btn-borrar').addEventListener('click', function () {
        const id = document.getElementById("ID").value;
        if (confirm("Desea eliminar el ID? " + id)) {
            eliminarPorId(id);
            actualizarFormulario();
            rellenarTabla();
        }
    });

    document.getElementById('btn-ocultar').addEventListener('click', function () {
        modal.style.display = 'none';
    });
}