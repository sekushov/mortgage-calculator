import {priceFormatter, priceFormatter1} from './../utils/formatters.js';

function updateResultsView(results) {
    document.querySelector('#total-percent').innerHTML = priceFormatter1.format(results.rate * 100) + '%';
    document.querySelector('#total-month-payment').innerHTML = priceFormatter.format(results.monthPayment);
    document.querySelector('#total-cost').innerHTML = priceFormatter.format(results.totalCost);
    document.querySelector('#total-overpayment').innerHTML = priceFormatter.format(results.overPayment);
}

export default updateResultsView;