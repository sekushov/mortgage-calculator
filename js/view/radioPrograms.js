import updateModel from "./../utils/updateModel.js";
import {priceFormatter3} from './../utils/formatters.js';

function init(changeRadio, inputRate, changeRate) {

    const radioBtns = document.querySelectorAll('input[name="program"]');
    const inputs = document.querySelectorAll('.radio-label-percent');

    radioBtns.forEach(function(radioBtn) {
        radioBtn.addEventListener('change', changeRadio)
    });

    inputs.forEach(function(input) {
        input.addEventListener('input', () => inputRate(input));

        input.addEventListener('change', () => changeRate(input));
        
    });
}

export default init;