import updateModel from "./../utils/updateModel.js";
import {priceFormatter3} from './../utils/formatters.js';

function init(getData) {

    const radioBtns = document.querySelectorAll('input[name="program"]');
    const inputRates = document.querySelectorAll('.radio-label-percent');

    //set program rates in radio buttons

    radioBtns.forEach(function(radioBtn) {
        radioBtn.addEventListener('change', function() {
            updateModel(this, {
                selectedProgram: +priceFormatter3.format(document.querySelector('.radio-hidden:checked + .radio-label .radio-label-percent').value / 100),
                onUpdate: 'radioProgram',
                id: this.id
            }); 
        });
    });

    inputRates.forEach(function(inputRate) {
        inputRate.addEventListener('input', function() {
            if (inputRate === document.querySelector('.radio-hidden:checked + .radio-label .radio-label-percent')) {
                updateModel(this, {
                    onUpdate: 'inputRate',
                    selectedProgram: +priceFormatter3.format(this.value / 100),
                });
            }
        });

        inputRate.addEventListener('change', () => {
            localStorage.setItem('mortgageRate', JSON.stringify({
                'base': +priceFormatter3.format(document.querySelector('#base-value + .radio-label .radio-label-percent').value / 100),
                'it': +priceFormatter3.format(document.querySelector('#it-value + .radio-label .radio-label-percent').value / 100),
                'gov': +priceFormatter3.format(document.querySelector('#gov-value + .radio-label .radio-label-percent').value / 100),
                'zero': +priceFormatter3.format(document.querySelector('#zero-value + .radio-label .radio-label-percent').value / 100)
            }))
        });
        
    });
}

export default init;