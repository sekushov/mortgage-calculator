import updateModel from './../utils/updateModel.js';

function init(getData) {
    const data = getData();
    const inputNumber = document.querySelector('#input-cost');

    const settings = {
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        delimiter: ' '
    };

    const cleaveInput = new Cleave(inputNumber, settings);
    cleaveInput.setRawValue(data.cost);

    inputNumber.addEventListener('input', function() {
        const value = +cleaveInput.getRawValue();

        if (value < data.minPrice || value > data.maxPrice) {
            inputNumber.closest('.param__details').classList.add('param__details--error');
        } else {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            updateModel(inputNumber, {cost: value, onUpdate: 'inputCost'});
        }

    });

    inputNumber.addEventListener('change', function() {
        const value = +cleaveInput.getRawValue();
        if (value > data.maxPrice) {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(Number(String(value).substr(0, 8)));
        }
        if (value < data.minPrice) {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(data.minPrice);
        }

        updateModel(inputNumber, {cost: +cleaveInput.getRawValue(), onUpdate: 'inputCost'});
    });

    return cleaveInput;
}

export default init;