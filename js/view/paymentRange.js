import updateModel from "./../utils/updateModel.js";

function init(getData) {
    const slider = document.querySelector('#slider-downpayment');
    let sliderValue;
    noUiSlider.create(slider, {
        start: getData().firstPaymentPercents * 100,
        connect: 'lower',
        tooltips: {to: function(value) {return parseInt(value) + '%'}},
        step: 1,
        range: {
            min: getData().minFirstPayment * 100,
            max: getData().maxFirstPayment * 100
        }
    });

    document.querySelector('.noUi-tooltip').style.display = 'none';
    slider.addEventListener('mouseleave', () => document.querySelector('.noUi-tooltip').style.display = 'none');
    slider.addEventListener('touchend', () => document.querySelector('.noUi-tooltip').style.display = 'none');

    slider.noUiSlider.on('slide', function() {
        document.querySelector('.noUi-tooltip').style.display = 'block';
        sliderValue = parseInt(slider.noUiSlider.get());
        updateModel(slider, {firstPaymentPercents: sliderValue / 100, onUpdate: 'paymentSlider'});
    });

    return slider;
}

export default init;