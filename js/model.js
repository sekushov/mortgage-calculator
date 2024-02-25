let data = {
    selectedProgram: 0.167,
    cost: 3000000,
    minPrice: 375000,
    maxPrice: 100000000,
    minFirstPayment: 0.2,
    getMinFirstPayment: function() {
        return this.cost * this.minFirstPayment
    },
    maxFirstPayment: 0.9,
    getMaxFirstPayment: function() {
        return this.cost * this.maxFirstPayment
    },
    firstPayment: 600000,
    firstPaymentPercents: 0.2,
    programs: {
        base: 0.167,
        it: 0.05,
        gov: 0.08,
        zero: 0.18,
    },
    term: 15,
    minTerm: 1,
    maxTerm: 30
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
    console.log('New data: ', newData);

    if (newData.onUpdate === 'radioProgram') {
        if (newData.id === 'zero-value') data.minFirstPayment = 0
        else if (newData.id === 'gov-value') data.minFirstPayment = 0.3
        else data.minFirstPayment = 0.2;
    }

    if (newData.onUpdate === 'inputCost' || newData.onUpdate === 'costSlider' || newData.onUpdate === 'radioProgram') {
        // если первый взнос не входит в допустимый интервал
        if (data.firstPayment > data.getMaxFirstPayment()) {
            data.firstPayment = data.getMaxFirstPayment();
        } else if (data.firstPayment < data.getMinFirstPayment()) {
            data.firstPayment = data.getMinFirstPayment();
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

    console.log('Updated data: ', data);
}

export {getData, setData, getResults};