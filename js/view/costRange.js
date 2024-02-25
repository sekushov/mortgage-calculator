import updateModel from "./../utils/updateModel.js";

function init(getData) {
    const slider = document.querySelector('#slider-cost');
    const data = getData();
    let sliderValue;
    noUiSlider.create(slider, {
        start: data.cost,
        connect: 'lower',
        tooltips: true,
        step: 100000,
        range: {
            min: data.minPrice,
            '1%': [400000, 100000],
            '50%': [10000000, 500000],
            max: data.maxPrice
        }
    });

    slider.noUiSlider.on('slide', function() {
        sliderValue = parseInt(slider.noUiSlider.get());
        console.log(sliderValue);
        updateModel(slider, {cost: sliderValue, onUpdate: 'costSlider'});
    });

    return slider;
}

export default init;