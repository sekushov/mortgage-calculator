import * as Model from './model.js';
import updateModel from './utils/updateModel.js';
import programs from './view/radioPrograms.js';
import updateResultsView from './view/updateResultsView.js';
import { updateMinFirstPayment } from './view/utils.js';
import { priceFormatter1, priceFormatter3 } from './utils/formatters.js';

import costInput from './view/costInput.js';
import costRange from './view/costRange.js';

import paymentInput from './view/paymentInput.js';
import paymentRange from './view/paymentRange.js';

import termInput from './view/termInput.js';
import termRange from './view/termRange.js';

import {deleteRows, addToComparison, sortComparison} from './view/comparison.js';

window.onload = function() {
    const getData = Model.getData;

    
    // init programs
    programs(changeRadio, inputRate, changeRate);
    function changeRadio() {
        updateModel(this, {
            selectedProgram: +priceFormatter3.format(document.querySelector('.radio-hidden:checked + .radio-label .radio-label-percent').value / 100),
            onUpdate: 'radioProgram',
            id: this.id
        }); 
    }
    function inputRate(input) {
        if (input === document.querySelector('.radio-hidden:checked + .radio-label .radio-label-percent')) {
            updateModel(input, {
                onUpdate: 'inputRate',
                selectedProgram: +priceFormatter3.format(input.value / 100),
            });
        }
    }
    function changeRate() {
        localStorage.setItem('mortgageRate', JSON.stringify({
            'base': +priceFormatter3.format(document.querySelector('#base-value + .radio-label .radio-label-percent').value / 100),
            'it': +priceFormatter3.format(document.querySelector('#it-value + .radio-label .radio-label-percent').value / 100),
            'gov': +priceFormatter3.format(document.querySelector('#gov-value + .radio-label .radio-label-percent').value / 100),
            'zero': +priceFormatter3.format(document.querySelector('#zero-value + .radio-label .radio-label-percent').value / 100)
        }))
    }


    // init cost input
    const cleaveCost = costInput(getData, updateModelByCostInput);
    function updateModelByCostInput(element, value) {
        updateModel(element, {cost: value, onUpdate: 'inputCost'});
    }
    const sliderCost = costRange(getData, updateModelByRangeInput);
    function updateModelByRangeInput(element, value) {
        updateModel(element, {cost: value, onUpdate: 'costSlider'});
    }


    // init payment input
    const cleavePayment = paymentInput(getData, updateModelByPaymentInput);
    function updateModelByPaymentInput(element, value) {
        updateModel(element, {firstPayment: value, onUpdate: 'inputPayment'});
    }
    const sliderPayment = paymentRange(getData, updateModelByPaymentRange);
    function updateModelByPaymentRange(element, value) {
        updateModel(element, {firstPaymentPercents: value, onUpdate: 'paymentSlider'});
    }


    // init term input
    const cleaveTerm = termInput(getData, updateModelByTermInput);
    function updateModelByTermInput(element, value) {
        updateModel(element, {term: value, onUpdate: 'inputTerm'});
    }
    const sliderTerm = termRange(getData, updateModelByTermRange);
    function updateModelByTermRange(element, value) {
        updateModel(element, {term: value, onUpdate: 'termSlider'});
    }


    // init start
    if (localStorage.getItem('mortgageRate')) {
        // set data from localStorage
        Model.setData({selectedProgram: +JSON.parse(localStorage.getItem('mortgageRate')).base});
        document.querySelector('#base-value + .radio-label .radio-label-percent').value = priceFormatter1.format(+JSON.parse(localStorage.getItem('mortgageRate')).base * 100);
        document.querySelector('#it-value + .radio-label .radio-label-percent').value = priceFormatter1.format(+JSON.parse(localStorage.getItem('mortgageRate')).it * 100);
        document.querySelector('#gov-value + .radio-label .radio-label-percent').value = priceFormatter1.format(+JSON.parse(localStorage.getItem('mortgageRate')).gov * 100);
        document.querySelector('#zero-value + .radio-label .radio-label-percent').value = priceFormatter1.format(+JSON.parse(localStorage.getItem('mortgageRate')).zero * 100);
    } else {
        // set default data
        Model.setData({});
        document.querySelector('#base-value + .radio-label .radio-label-percent').value = getData().programs.base * 100;
        document.querySelector('#it-value + .radio-label .radio-label-percent').value = getData().programs.it * 100;
        document.querySelector('#gov-value + .radio-label .radio-label-percent').value = getData().programs.gov * 100;
        document.querySelector('#zero-value + .radio-label .radio-label-percent').value = getData().programs.zero * 100;
    }
    if (localStorage.getItem('mortgageComparison')) {
        Model.setData({comparison: JSON.parse(localStorage.getItem('mortgageComparison'))});
        addToComparison(JSON.parse(localStorage.getItem('mortgageComparison')));
    }
    const results = Model.getResults();
    updateResultsView(results.rate, results.monthPayment, results.totalCost, results.overPayment);

    // update form
    document.addEventListener('updateForm', (e) => {
        Model.setData(e.detail);

        const data = Model.getData();
        const results = Model.getResults();

        updateFormAndSliders(data);

        updateResultsView(results.rate, results.monthPayment, results.totalCost, results.overPayment);
    });

    function updateFormAndSliders(data) {
        // update radiobuttons
        if (data.onUpdate === 'radioProgram') {
            updateMinFirstPayment(data);
            sliderPayment.noUiSlider.updateOptions({
                range: {
                    min: data.minFirstPayment * 100,
                    max: data.maxFirstPayment * 100
                }
            })
        }

        // update values
        if (data.onUpdate !== 'inputCost') {
            cleaveCost.setRawValue(data.cost);
        } 
        if (data.onUpdate !== 'costSlider') {
            sliderCost.noUiSlider.set(data.cost);
        }
        if (data.onUpdate !== 'inputPayment') {
            cleavePayment.setRawValue(data.firstPayment);
        }
        if (data.onUpdate !== 'paymentSlider') {
            sliderPayment.noUiSlider.set(data.firstPaymentPercents * 100);
            document.querySelector('.noUi-tooltip').style.display = 'none';
        }
        if (data.onUpdate === 'inputTerm') {
            sliderTerm.noUiSlider.set(data.term);
        }
        if (data.onUpdate === 'termSlider') {
            cleaveTerm.setRawValue(data.term);
        }
    }

    

    // add to comparison
    const comparisonList = getData().comparison,
          table = document.querySelector('#comparison-table'),
          addToComparisonBtn = document.querySelector('#add-to-comparison-btn');
        
    addToComparisonBtn.addEventListener('click', () => {
        const data = getData();
        function getMaxId(array) {
            let max = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i].id >= max) max = array[i].id;
            }
            return max;
        }
        comparisonList.push({
            id: getMaxId(comparisonList) + 1,
            title: data.id ? data.id : 'base-value',
            monthPayment: parseInt(Model.getResults().monthPayment),
            firstPayment: data.firstPayment,
            selectedProgram: data.selectedProgram,
            cost: data.cost,
            term: data.term,
        });
        updateModel(addToComparisonBtn, {comparison: comparisonList, onUpdate: 'addToComparisonBtn'});

        addToComparison(comparisonList);

        localStorage.setItem('mortgageComparison', JSON.stringify(comparisonList));
    });
    
    // table btns
    table.addEventListener('click', (e) => {
        if (e.target.className !== 'table-del-btn') return;
        let delBtn = e.target;
        comparisonList.splice(delBtn.closest('tr').rowIndex - 1, 1);
        updateModel(addToComparisonBtn, {comparison: comparisonList, onUpdate: 'delComparisonBtn'});
        localStorage.setItem('mortgageComparison', JSON.stringify(comparisonList));
        deleteRows(e);
    });

    sortComparison();

}