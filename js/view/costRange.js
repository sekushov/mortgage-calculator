function init(getData, updateModel) {
    const slider = document.querySelector('#slider-cost');
    const data = getData();
    let sliderValue;
    noUiSlider.create(slider, {
        start: data.cost,
        connect: 'lower',
        step: 100000,
        range: {
            min: data.minPrice,
            '1%': [400000, 100000],
            '70%': [10000000, 500000],
            max: data.maxPrice
        }
    });

    slider.noUiSlider.on('slide', function() {
        sliderValue = parseInt(slider.noUiSlider.get());
        updateModel(slider, sliderValue);
    });

    return slider;
}

export default init;