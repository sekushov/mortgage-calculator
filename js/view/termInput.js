import updateModel from '../utils/updateModel.js';

function init(getData) {
    const inputNumber = document.querySelector('#input-term');

    const settings = {
        numeral: true,
    };

    const cleaveInput = new Cleave(inputNumber, settings);
    cleaveInput.setRawValue(getData().term);

    inputNumber.addEventListener('input', function() {
        const value = +cleaveInput.getRawValue();

        if (value < getData().minTerm || value > getData().maxTerm) {
            inputNumber.closest('.param__details').classList.add('param__details--error');
        } else {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            updateModel(inputNumber, {term: value, onUpdate: 'inputTerm'});
        }

    });

    inputNumber.addEventListener('change', function() {
        const value = +cleaveInput.getRawValue();
        if (value > getData().maxTerm) {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(getData().maxTerm);
        } else if (value < getData().minTerm) {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(getData().minTerm);
        }

        updateModel(inputNumber, {term: value, onUpdate: 'inputTerm'});
    });

    return cleaveInput;
}

export default init;