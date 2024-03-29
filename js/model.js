let data = {
    selectedProgram: 0.167,
    cost: 3300000,
    minPrice: 500000,
    maxPrice: 30000000,
    minFirstPayment: 0.2,
    getMinFirstPayment: function() {
        return this.cost * this.minFirstPayment
    },
    maxFirstPayment: 0.9,
    getMaxFirstPayment: function() {
        return this.cost * this.maxFirstPayment
    },
    firstPayment: 990000,
    firstPaymentPercents: 0.3,
    programs: {
        base: 0.167,
        it: 0.05,
        gov: 0.08,
        zero: 0.18,
    },
    term: 20,
    minTerm: 1,
    maxTerm: 30,
    comparison: []
};

let results = {
    rate: data.selectedProgram,
};

function getData() {
    return {...data}
}
function getResults() {
    return {...results}
}

function setData(newData) {
    // console.log('New data: ', newData);

    if (newData.onUpdate === 'radioProgram') {
        if (newData.id === 'zero-value') data.minFirstPayment = 0
        else if (newData.id === 'gov-value') data.minFirstPayment = 0.3
        else data.minFirstPayment = 0.2;

        // если первый взнос не входит в допустимый интервал
        if (data.firstPayment > data.getMaxFirstPayment()) {
            data.firstPayment = data.getMaxFirstPayment();
        } else if (data.firstPayment < data.getMinFirstPayment()) {
            data.firstPayment = data.getMinFirstPayment();
        }
        data.firstPaymentPercents = data.firstPayment / data.cost;
    }

    if (newData.onUpdate === 'inputCost' || newData.onUpdate === 'costSlider') {
        // если первый взнос не входит в допустимый интервал
        if (data.firstPayment > newData.cost * data.maxFirstPayment) {
            data.firstPayment = newData.cost * data.maxFirstPayment;
        } else if (data.firstPayment < newData.cost * data.minFirstPayment) {
            data.firstPayment = newData.cost * data.minFirstPayment;
        }
        data.firstPaymentPercents = data.firstPayment / newData.cost;
    }

    if (newData.onUpdate === 'inputPayment') {
        // если первый взнос не входит в допустимый интервал
        if (newData.firstPayment > data.getMaxFirstPayment()) {
            newData.firstPayment = data.getMaxFirstPayment();
        } else if (newData.firstPayment < data.getMinFirstPayment()) {
            newData.firstPayment = data.getMinFirstPayment();
        }
        newData.firstPaymentPercents = newData.firstPayment / data.cost;
    }

    if (newData.onUpdate === 'paymentSlider') {
        data.firstPayment = Math.round(data.cost * newData.firstPaymentPercents);
    }

    // если срок кредита не в интервале
    if (newData.onUpdate === 'inputTerm') {
        if (newData.term > data.maxTerm) {
            newData.term = data.maxTerm;
        } else if (newData.term < data.minTerm) {
            newData.term = data.minTerm;
        }
    }

    data = {
        ...data,
        ...newData
    }

    // формула ипотеки
    const months = data.term * 12;
    const totalCost = data.cost - data.firstPayment;
    const monthRate = data.selectedProgram / 12;
    const generalRate = (1 + monthRate) ** months;
    const monthPayment = (totalCost * monthRate * generalRate) / (generalRate - 1);
    const overPayment = monthPayment * months - totalCost;
    results = {
        rate: data.selectedProgram,
        totalCost,
        monthPayment,
        overPayment
    }

    // console.log('Updated data: ', data);
}

export {getData, setData, getResults};