import { plural, priceFormatter } from '../utils/formatters.js';

const table = document.querySelector('#comparison-table');
const tbody = table.querySelector('tbody');
const addToComparisonBtn = document.querySelector('#add-to-comparison-btn');

function sortComparison() {
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
}


   
function addToComparison(comparisonList) {
    // create table
    table.style.display = 'block';
    tbody.innerHTML = '';

    for (let i = 0; i < comparisonList.length; i++) {
        let tr = document.createElement('tr');
        for (let key in comparisonList[i]) {
            let td = document.createElement('td');
            switch (key) {
                case 'id': continue;
                case 'monthPayment': td.innerHTML = priceFormatter.format(comparisonList[i][key]);
                    break;
                case 'title': if (screen.orientation.type === 'landscape-primary') {
                    switch (comparisonList[i][key]) {
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
                case 'selectedProgram': td.innerHTML = comparisonList[i][key] * 100 + '\t' + '%';
                    break;
                case 'firstPayment': td.innerHTML = priceFormatter.format(comparisonList[i][key]);
                    break;
                case 'cost': td.innerHTML = priceFormatter.format(comparisonList[i][key]);
                    break;
                case 'term': td.innerHTML = comparisonList[i][key] + '\t' + plural(comparisonList[i][key], {
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

}



// table btns
function deleteRows(e) {
    e.target.closest('tr').remove();
}
   
export {deleteRows, addToComparison, sortComparison};