function init(getData, updateModel) {
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
            updateModel(inputNumber, +cleaveInput.getRawValue());
        }
    });

    inputNumber.addEventListener('change', function() {
        const value = +cleaveInput.getRawValue();
        if (value > data.maxPrice) {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(data.maxPrice);
        }
        if (value < data.minPrice) {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(data.minPrice);
        }
        updateModel(inputNumber, +cleaveInput.getRawValue());
    });

    return cleaveInput;
}

export default init;