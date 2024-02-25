const priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
});

const priceFormatter1 = new Intl.NumberFormat('en-GB', {
    style: 'decimal',
    maximumFractionDigits: 1,
});

const priceFormatter3 = new Intl.NumberFormat('en-GB', {
    style: 'decimal',
    maximumFractionDigits: 3,
});

export {priceFormatter, priceFormatter1, priceFormatter3};