import { plural, priceFormatter } from '../utils/formatters.js';
import updateModel from './../utils/updateModel.js';

function init(getData, getResults) {
    const comparison = getData().comparison;
    const table = document.querySelector('#comparison-table');
    const tbody = table.querySelector('tbody');

    const addToComparisonBtn = document.querySelector('#add-to-comparison-btn');
    addToComparisonBtn.addEventListener('click', () => {
        function getMaxId(array) {
            let max = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i].id >= max) max = array[i].id;
            }
            return max;
        }
        comparison.push({
            id: getMaxId(comparison) + 1,
            title: getData().id ? getData().id : 'base-value',
            monthPayment: parseInt(getResults().monthPayment),
            firstPayment: getData().firstPayment,
            selectedProgram: getData().selectedProgram,
            cost: getData().cost,
            term: getData().term,
        });

        updateModel(addToComparisonBtn, {comparison: comparison, onUpdate: 'addToComparisonBtn'});
        

        // create table
        table.style.display = 'block';
        tbody.innerHTML = '';
        const settings = {
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
            delimiter: ' '
        };
    
        for (let i = 0; i < getData().comparison.length; i++) {
            let tr = document.createElement('tr');
            for (let key in getData().comparison[i]) {
                let td = document.createElement('td');
                switch (key) {
                    case 'id': continue;
                    case 'monthPayment': td.innerHTML = priceFormatter.format(getData().comparison[i][key]);
                        break;
                    case 'title': if (screen.orientation.type === 'landscape-primary') {
                        switch (getData().comparison[i][key]) {
                            case 'base-value': td.innerHTML = 'Базовая';
                                break;
                            case 'it-value': td.innerHTML = 'IT';
                                break;
                            case 'gov-value': td.innerHTML = 'Гос. поддержка';
                                break;
                            case 'zero-value': td.innerHTML = 'Без 1-го вноса';
                                break;
                            default: td.innerHTML = 'Базовая';
                        }
                            table.firstElementChild.firstElementChild.firstElementChild.style.display = 'table-cell';
                        } else {
                            table.firstElementChild.firstElementChild.firstElementChild.style.display = 'none';
                            continue;
                        }
                        break;
                    case 'selectedProgram': td.innerHTML = getData().comparison[i][key] * 100 + '\t' + '%';
                        break;
                    case 'firstPayment': td.innerHTML = priceFormatter.format(getData().comparison[i][key]);
                        break;
                    case 'cost': td.innerHTML = priceFormatter.format(getData().comparison[i][key]);
                        break;
                    case 'term': td.innerHTML = getData().comparison[i][key] + '\t' + plural(getData().comparison[i][key], {
                            one: 'год',
                            few: 'года',
                            many: 'лет'
                        });
                        break;
                }
		        tr.appendChild(td);                
            }
            const tdBtn = document.createElement('td');
            tdBtn.innerHTML = '<button class="table-del-btn">Удалить</button>';
            tr.appendChild(tdBtn);
            tbody.appendChild(tr);
        }

    });


    // sort table
    let sort = true;
    table.addEventListener('click', (e) => {
        if (e.target.tagName !== 'TH') return;
        let th = e.target;
        if (table.querySelector('th').style.display === 'table-cell') sortGrid(th.cellIndex, th.dataset.type)
        else if (table.querySelector('th').style.display === 'none') sortGrid(th.cellIndex-1, th.dataset.type);
        sort = !sort;
        if (table.querySelector('th.active')) table.querySelector('th.active').classList.remove('active');
        th.classList.add('active');
    });
    function sortGrid(colNum, type) {
        let rowsArray = Array.from(tbody.rows);
        // compare(a, b) сравнивает две строки, нужен для сортировки
        let compare;
        switch (type) {
            case 'number':
                compare = function(rowA, rowB) {
                    return sort ? 
                        (+rowA.cells[colNum].innerHTML.replace(/[^0-9,.]/g, '') - +rowB.cells[colNum].innerHTML.replace(/[^0-9,.]/g, ''))
                        : (+rowB.cells[colNum].innerHTML.replace(/[^0-9,.]/g, '') - +rowA.cells[colNum].innerHTML.replace(/[^0-9,.]/g, ''))
                };
                break;
            case 'string':
                compare = function(rowA, rowB) {
                    return sort ? 
                        (rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1)
                        : (rowA.cells[colNum].innerHTML < rowB.cells[colNum].innerHTML ? 1 : -1)
                };
                break;
        }
        rowsArray.sort(compare);
        tbody.append(...rowsArray);
    }


    // table btns
    table.addEventListener('click', (e) => {
        if (e.target.className !== 'table-del-btn') return;
        let delBtn = e.target;
        let delTr = delBtn.closest('tr');
        comparison.splice(delTr.rowIndex - 1, 1);
        delTr.remove();
        updateModel(addToComparisonBtn, {comparison: comparison, onUpdate: 'delComparisonBtn'});
    });

}

export default init;