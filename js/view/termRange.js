import updateModel from "./../utils/updateModel.js";

function init(getData) {
    const slider = document.querySelector('#slider-term');
    let sliderValue;
    noUiSlider.create(slider, {
        start: getData().term,
        connect: 'lower',
        tooltips: true,
        step: 1,
        range: {
            min: getData().minTerm,
            max: getData().maxTerm
        }
    });

    slider.noUiSlider.on('slide', function() {
        sliderValue = parseInt(slider.noUiSlider.get());
        updateModel(slider, {term: sliderValue, onUpdate: 'termSlider'});
    });

    return slider;
}

export default init;