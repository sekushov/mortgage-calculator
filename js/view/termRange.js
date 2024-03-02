function init(getData, updateModel) {
    const slider = document.querySelector('#slider-term');
    let sliderValue;
    noUiSlider.create(slider, {
        start: getData().term,
        connect: 'lower',
        step: 1,
        range: {
            min: getData().minTerm,
            max: getData().maxTerm
        }
    });

    slider.noUiSlider.on('slide', function() {
        sliderValue = parseInt(slider.noUiSlider.get());
        updateModel(slider, sliderValue);
    });

    return slider;
}

export default init;