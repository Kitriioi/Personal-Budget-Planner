let transactionHistory = [];
let totalAmount = 0;
let expenses = [];
let debts = [];
let bills = [];
let budgetChart = null;

// Click ripple effect
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - 10) + 'px';
    ripple.style.top = (e.clientY - 10) + 'px';
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

const amountInput = document.getElementById('amountInput');
const addBtn = document.getElementById('addBtn');
const resultsList = document.getElementById('resultsList');

const billsCategoryInput = document.getElementById('bills-category');
const billsDueInput = document.getElementById('bills-due');
const billsCostInput = document.getElementById('bills-cost');
const billsBudgetInput = document.getElementById('bills-budget');
const billsAddBtn = document.getElementById('bills-add-btn');

const expenseCategoryInput = document.getElementById('expense-category');
const expenseBudgetInput = document.getElementById('expense-budget');
const expenseActualInput = document.getElementById('expense-actual');
const expenseAddBtn = document.getElementById('expense-add-btn');

const debtCategoryInput = document.getElementById('debt-category');
const debtDueInput = document.getElementById('debt-due');
const debtBudgetInput = document.getElementById('debt-budget');
const debtActualInput = document.getElementById('debt-actual');
const debtAddBtn = document.getElementById('debt-add-btn');

billsAddBtn.addEventListener('click', function() {
    const category = billsCategoryInput.value;
    const due = billsDueInput.value;
    const cost = parseFloat(billsCostInput.value);
    const budget = parseFloat(billsBudgetInput.value);
    
    if (category && due && cost >= 0 && budget > 0) {
        bills.push({
            category: category,
            due: due,
            cost: cost,
            budget: budget
        });
        
        billsCategoryInput.value = '';
        billsDueInput.value = '';
        billsCostInput.value = '';
        billsBudgetInput.value = '';
        updateBillsDisplay();
        updateBudgetChart();
    } else {
        alert('Podaj prawidłowe dane!');
    }
});

expenseAddBtn.addEventListener('click', function() {
    const category = expenseCategoryInput.value;
    const budget = parseFloat(expenseBudgetInput.value);
    const actual = parseFloat(expenseActualInput.value);
    
    if (category && budget > 0 && actual >= 0) {
        expenses.push({
            category: category,
            budget: budget,
            actual: actual
        });
        
        expenseCategoryInput.value = '';
        expenseBudgetInput.value = '';
        expenseActualInput.value = '';
        updateExpenseDisplay();
        updateBudgetChart();
    } else {
        alert('Podaj prawidłowe dane!');
    }
});

debtAddBtn.addEventListener('click', function() {
    const category = debtCategoryInput.value;
    const due = debtDueInput.value;
    const budget = parseFloat(debtBudgetInput.value);
    const actual = parseFloat(debtActualInput.value);
    
    if (category && due && budget > 0 && actual >= 0) {
        debts.push({
            category: category,
            due: due,
            budget: budget,
            actual: actual
        });
        
        debtCategoryInput.value = '';
        debtDueInput.value = '';
        debtBudgetInput.value = '';
        debtActualInput.value = '';
        updateDebtDisplay();
        updateBudgetChart();
    } else {
        alert('Podaj prawidłowe dane!');
    }
});

function updateBillsDisplay() {
    const list = document.getElementById('rachunki-list');
    list.innerHTML = '';
    let totalCost = 0;
    let totalBudget = 0;
    
    bills.forEach((bill, index) => {
        totalCost += bill.cost;
        totalBudget += bill.budget;
        
        const row = document.createElement('tr');
        const dueDate = new Date(bill.due).toLocaleDateString('pl-PL');
        
        row.innerHTML = `
            <td></td>
            <td class="category">${bill.category}</td>
            <td>${dueDate}</td>
            <td class="budget">${bill.budget.toFixed(2)} zł</td>
            <td class="actual">${bill.cost.toFixed(2)} zł</td>
            <td class="actions">
                <button class="bills-table-delete" data-index="${index}">Usuń</button>
            </td>
        `;
        
        const deleteBtn = row.querySelector('.bills-table-delete');
        deleteBtn.addEventListener('click', function() {
            bills.splice(index, 1);
            updateBillsDisplay();
            updateBudgetChart();
        });
        
        list.appendChild(row);
    });
}

addBtn.addEventListener('click', function() {
    const amount = parseFloat(amountInput.value);
    
    if (amount > 0) {
        transactionHistory.push({
            amount: amount,
            date: new Date().toLocaleString('pl-PL')
        });
        
        totalAmount += amount;
        
        amountInput.value = '';
        updateDisplay();
        updateBudgetChart();
    } else {
        alert('Podaj prawidłową kwotę!');
    }
});

amountInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addBtn.click();
    }
});

function deleteTransaction(index) {
    totalAmount -= transactionHistory[index].amount;
    transactionHistory.splice(index, 1);
    updateDisplay();
}

function updateExpenseDisplay() {
    const list = document.getElementById('wydatki-list');
    list.innerHTML = '';
    
    expenses.forEach((expense, index) => {
        const left = expense.budget - expense.actual;
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td class="category">${expense.category}</td>
            <td>${expense.budget.toFixed(2)} zł</td>
            <td>${expense.actual.toFixed(2)} zł</td>
            <td>${left.toFixed(2)} zł</td>
            <td class="actions">
                <button class="expense-table-delete" data-index="${index}">Usuń</button>
            </td>
        `;
        
        const deleteBtn = row.querySelector('.expense-table-delete');
        deleteBtn.addEventListener('click', function() {
            expenses.splice(index, 1);
            updateExpenseDisplay();
            updateBudgetChart();
        });
        
        list.appendChild(row);
    });
}

function updateDebtDisplay() {
    const list = document.getElementById('długi-list');
    list.innerHTML = '';
    
    debts.forEach((debt, index) => {
        const dueDate = new Date(debt.due).toLocaleDateString('pl-PL');
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td class="category">${debt.category}</td>
            <td>${dueDate}</td>
            <td>${debt.budget.toFixed(2)} zł</td>
            <td>${debt.actual.toFixed(2)} zł</td>
            <td class="actions">
                <button class="debt-table-delete" data-index="${index}">Usuń</button>
            </td>
        `;
        
        const deleteBtn = row.querySelector('.debt-table-delete');
        deleteBtn.addEventListener('click', function() {
            debts.splice(index, 1);
            updateDebtDisplay();
            updateBudgetChart();
        });
        
        list.appendChild(row);
    });
}

function updateDisplay() {
    resultsList.innerHTML = '';
    
    if (transactionHistory.length > 0) {
        const historyDiv = document.createElement('div');
        historyDiv.className = 'history-section';
        historyDiv.innerHTML = '<h3>Historia dodanych kwot:</h3>';
        
        transactionHistory.forEach((transaction, index) => {
            const transItem = document.createElement('div');
            transItem.className = 'transaction-item';
            transItem.innerHTML = `
                <div class="trans-content">
                    ${index + 1}. <span class="amount">${transaction.amount.toFixed(2)} zł</span>
                    <span class="date">${transaction.date}</span>
                </div>
                <button class="delete-btn" data-index="${index}">Usuń</button>
            `;
            
            const deleteBtn = transItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                deleteTransaction(index);
                updateBudgetChart();
            });
            
            historyDiv.appendChild(transItem);
        });
        
        resultsList.appendChild(historyDiv);
    }
    
    if (totalAmount > 0) {
        const totalItem = document.createElement('div');
        totalItem.className = 'total-item';
        totalItem.innerHTML = `<strong>Razem:</strong> ${totalAmount.toFixed(2)} zł`;
        resultsList.appendChild(totalItem);
    }
}

document.querySelectorAll('.category-add-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.dataset.category;
        const parent = this.closest('.category-column');
        const amountInput = parent.querySelector('.category-amount');
        const descInput = parent.querySelector('.category-desc');
        const amount = parseFloat(amountInput.value);
        const desc = descInput.value;
        
        if (amount > 0) {
            categories[category].push({
                amount: amount,
                desc: desc,
                date: new Date().toLocaleString('pl-PL')
            });
            
            amountInput.value = '';
            descInput.value = '';
            updateCategoryDisplay(category);
        } else {
            alert('Podaj prawidłową kwotę!');
        }
    });
});

function updateCategoryDisplay(category) {
    const list = document.getElementById(`${category}-list`);
    list.innerHTML = '';
    let total = 0;
    
    categories[category].forEach((item, index) => {
        total += item.amount;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'category-item';
        itemDiv.innerHTML = `
            <div class="category-item-content">
                <div class="category-item-amount">${item.amount.toFixed(2)} zł</div>
                <div class="category-item-desc">${item.desc || 'bez opisu'}</div>
            </div>
            <button class="category-delete-btn" data-index="${index}">Usuń</button>
        `;
        
        const deleteBtn = itemDiv.querySelector('.category-delete-btn');
        deleteBtn.addEventListener('click', function() {
            categories[category].splice(index, 1);
            updateCategoryDisplay(category);
        });
        
        list.appendChild(itemDiv);
    });
    
    if (total > 0) {
        const totalDiv = document.createElement('div');
        totalDiv.className = 'category-total';
        totalDiv.innerHTML = `<strong>Razem: ${total.toFixed(2)} zł</strong>`;
        list.appendChild(totalDiv);
    }
}

function updateBudgetChart() {
    let billsTotal = 0;
    let expensesTotal = 0;
    let debtsTotal = 0;
    
    bills.forEach(bill => {
        billsTotal += bill.cost;
    });
    
    expenses.forEach(expense => {
        expensesTotal += expense.actual;
    });
    
    debts.forEach(debt => {
        debtsTotal += debt.actual;
    });
    
    const freeFunds = Math.max(0, totalAmount - billsTotal - expensesTotal - debtsTotal);
    
    const ctx = document.getElementById('budgetChart').getContext('2d');
    
    if (budgetChart) {
        budgetChart.destroy();
    }
    
    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Wolne środki', 'Rachunki', 'Wydatki', 'Długi'],
            datasets: [{
                data: [freeFunds, billsTotal, expensesTotal, debtsTotal],
                backgroundColor: [
                    '#51cf66',
                    '#FF1493',
                    '#FFB6C1',
                    '#ff6b6b'
                ],
                borderColor: [
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    updateChartLegend(freeFunds, billsTotal, expensesTotal, debtsTotal);
}

function updateChartLegend(free, bills, expenses, debts) {
    const legend = document.getElementById('chartLegend');
    legend.innerHTML = '';
    
    const items = [
        { label: 'Wolne', value: free, color: '#51cf66' },
        { label: 'Rachunki', value: bills, color: '#FF1493' },
        { label: 'Wydatki', value: expenses, color: '#FFB6C1' },
        { label: 'Długi', value: debts, color: '#ff6b6b' }
    ];
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'chart-legend-item';
        div.innerHTML = `
            <div class="chart-legend-color" style="background-color: ${item.color}"></div>
            <div class="chart-legend-text">${item.label}: <span class="chart-legend-value">${item.value.toFixed(2)} zł</span></div>
        `;
        legend.appendChild(div);
    });
}
