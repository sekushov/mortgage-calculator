import * as Model from './model.js';
import updateModel from './utils/updateModel.js';
import programs from './view/radioPrograms.js';
import updateResultsView from './view/updateResultsView.js';
import { updateMinFirstPayment } from './view/utils.js';
import { priceFormatter1 } from './utils/formatters.js';

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
    programs();

    // init cost input
    const cleaveCost = costInput(getData);
    const sliderCost = costRange(getData);

    // init payment input
    const cleavePayment = paymentInput(getData);
    const sliderPayment = paymentRange(getData);

    // init term input
    const cleaveTerm = termInput(getData);
    const sliderTerm = termRange(getData);

    // init start
    if (localStorage.getItem('mortgageRate')) {
        Model.setData({selectedProgram: +JSON.parse(localStorage.getItem('mortgageRate')).base});
        document.querySelector('#base-value + .radio-label .radio-label-percent').value = priceFormatter1.format(+JSON.parse(localStorage.getItem('mortgageRate')).base * 100);
        document.querySelector('#it-value + .radio-label .radio-label-percent').value = priceFormatter1.format(+JSON.parse(localStorage.getItem('mortgageRate')).it * 100);
        document.querySelector('#gov-value + .radio-label .radio-label-percent').value = priceFormatter1.format(+JSON.parse(localStorage.getItem('mortgageRate')).gov * 100);
        document.querySelector('#zero-value + .radio-label .radio-label-percent').value = priceFormatter1.format(+JSON.parse(localStorage.getItem('mortgageRate')).zero * 100);
    } else {
        Model.setData({});
        document.querySelector('#base-value + .radio-label .radio-label-percent').value = getData().programs.base * 100;
        document.querySelector('#it-value + .radio-label .radio-label-percent').value = getData().programs.it * 100;
        document.querySelector('#gov-value + .radio-label .radio-label-percent').value = getData().programs.gov * 100;
        document.querySelector('#zero-value + .radio-label .radio-label-percent').value = getData().programs.zero * 100;
    }
    const results = Model.getResults();
    updateResultsView(results);

    // update form
    document.addEventListener('updateForm', (e) => {
        Model.setData(e.detail);

        const data = Model.getData();
        const results = Model.getResults();

        updateFormAndSliders(data);

        //update results
        updateResultsView(results);
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
    });
    
    // table btns
    table.addEventListener('click', (e) => {
        if (e.target.className !== 'table-del-btn') return;
        let delBtn = e.target;
        comparisonList.splice(delBtn.closest('tr').rowIndex - 1, 1);
        updateModel(addToComparisonBtn, {comparison: comparisonList, onUpdate: 'delComparisonBtn'});
        deleteRows(e);
    });

    sortComparison();

}