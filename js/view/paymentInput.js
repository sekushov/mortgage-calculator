function init(getData, updateModel) {
    
    const inputNumber = document.querySelector('#input-downpayment');

    const settings = {
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        delimiter: ' '
    };

    const cleaveInput = new Cleave(inputNumber, settings);
    cleaveInput.setRawValue(getData().firstPayment);

    inputNumber.addEventListener('input', function() {
        const value = +cleaveInput.getRawValue();
        if (value < getData().getMinFirstPayment() || value > getData().getMaxFirstPayment()) {
            inputNumber.closest('.param__details').classList.add('param__details--error');
        } else {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            updateModel(inputNumber, value);
        }
    });

    inputNumber.addEventListener('change', function() {
        const value = +cleaveInput.getRawValue();
        if (value > getData().getMaxFirstPayment()) {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(getData().getMaxFirstPayment());
        } else if (value < getData().getMinFirstPayment()) {
            inputNumber.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(getData().getMinFirstPayment());
        }

        updateModel(inputNumber, +cleaveInput.getRawValue());
    });

    return cleaveInput;
}

export default init;