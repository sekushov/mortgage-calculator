// for program with different firstPayment
function updateMinFirstPayment(data) {
    document.querySelector('#percents-from').innerText = data.minFirstPayment * 100 + '%';
}

export { updateMinFirstPayment };