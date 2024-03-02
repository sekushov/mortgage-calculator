import {priceFormatter, priceFormatter1} from './../utils/formatters.js';

function updateResultsView(rate, monthPayment, totalCost, overPayment) {
    document.querySelector('#total-percent').innerHTML = priceFormatter1.format(rate * 100) + '%';
    document.querySelector('#total-month-payment').innerHTML = priceFormatter.format(monthPayment);
    document.querySelector('#total-cost').innerHTML = priceFormatter.format(totalCost);
    document.querySelector('#total-overpayment').innerHTML = priceFormatter.format(overPayment);
}

export default updateResultsView;