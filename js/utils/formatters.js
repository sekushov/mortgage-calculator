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

function plural(value, variants = {}, locale = 'ru-RU') {
    const key = new Intl.PluralRules(locale).select(value);
    return variants[key] || '';
}

export {priceFormatter, priceFormatter1, priceFormatter3, plural};