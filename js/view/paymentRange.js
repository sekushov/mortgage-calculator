import updateModel from "./../utils/updateModel.js";

function init(getData) {
    const slider = document.querySelector('#slider-downpayment');
    let sliderValue;
    noUiSlider.create(slider, {
        start: getData().firstPaymentPercents * 100,
        connect: 'lower',
        step: 1,
        range: {
            min: getData().minFirstPayment * 100,
            max: getData().maxFirstPayment * 100
        }
    });

    slider.noUiSlider.on('slide', function() {
        sliderValue = parseInt(slider.noUiSlider.get());
        updateModel(slider, {firstPaymentPercents: sliderValue / 100, onUpdate: 'paymentSlider'});
    });

    return slider;
}

export default init;