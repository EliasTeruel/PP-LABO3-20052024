export function mostrarSpinner(){
    const spinner = document.getElementById("spinner");
    spinner.style.display = "flex";
}

export function ocultarSpinner(){
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none";
}

export function mostrarSpinnerLoad(){
    const spinnerLoad = document.getElementById("spinnerLoad");
    spinnerLoad.style.display = "flex";
}

export function ocultarSpinnerLoad(){
    const spinnerLoad = document.getElementById("spinnerLoad");
    spinnerLoad.style.display = "none";
}