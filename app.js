// Struttura del budget
let budget = {
    incomes: [],
    expenses: []
};

// Indici per modifiche
let editingIncomeIndex = null;
let editingExpenseIndex = null;

// Funzione per aggiungere un'entrata
function addIncome() {
    const user = document.getElementById('income-user').value;
    const category = document.getElementById('income-category').value;
    const source = document.getElementById('income-source').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    const date = document.getElementById('income-date').value;

    if (user && category && source && !isNaN(amount) && date) {
        const income = { user, category, source, amount, date };
        if (editingIncomeIndex !== null) {
            budget.incomes[editingIncomeIndex] = income; // Modifica l'entrata esistente
            editingIncomeIndex = null; // Resetta l'indice
        } else {
            budget.incomes.push(income); // Aggiunge una nuova entrata
        }
        resetIncomeForm(); // Resetta il modulo delle entrate
        renderBudget(); // Rende il budget aggiornato
    } else {
        alert('Compila tutti i campi obbligatori.');
    }
}

// Funzione per aggiungere un'uscita
function addExpense() {
    const user = document.getElementById('expense-user').value;
    const category = document.getElementById('expense-category').value;
    const description = document.getElementById('expense-description').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;

    if (user && category && description && !isNaN(amount) && date) {
        const expense = { user, category, description, amount, date };
        if (editingExpenseIndex !== null) {
            budget.expenses[editingExpenseIndex] = expense; // Modifica l'uscita esistente
            editingExpenseIndex = null; // Resetta l'indice
        } else {
            budget.expenses.push(expense); // Aggiunge una nuova uscita
        }
        resetExpenseForm(); // Resetta il modulo delle uscite
        renderBudget(); // Rende il budget aggiornato
    } else {
        alert('Compila tutti i campi obbligatori.');
    }
}

// Funzione per resettare il modulo delle entrate
function resetIncomeForm() {
    document.getElementById('income-user').value = '';
    document.getElementById('income-category').value = '';
    document.getElementById('income-source').value = '';
    document.getElementById('income-amount').value = '';
    document.getElementById('income-date').value = new Date().toISOString().split('T')[0]; // Reset della data
}

// Funzione per resettare il modulo delle uscite
function resetExpenseForm() {
    document.getElementById('expense-user').value = '';
    document.getElementById('expense-category').value = '';
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-date').value = new Date().toISOString().split('T')[0]; // Reset della data
}

// Funzione per visualizzare il budget
function renderBudget() {
    const month = document.getElementById('month-selector').value;
    const budgetSummary = document.getElementById('budget-summary').getElementsByTagName('tbody')[0];
    const totalBudgetSummary = document.getElementById('total-budget-summary').getElementsByTagName('tbody')[0];
    const categorySummary = document.getElementById('category-summary').getElementsByTagName('tbody')[0];
    const userIncomeTotal = { Alessio: 0, Giulia: 0 };
    const userExpenseTotal = { Alessio: 0, Giulia: 0 };

    budgetSummary.innerHTML = ''; // Resetta il riepilogo mensile
    totalBudgetSummary.innerHTML = ''; // Resetta il riepilogo totale
    categorySummary.innerHTML = ''; // Resetta il riepilogo per categoria

    // Filtra le entrate e le uscite in base al mese selezionato
    const filteredIncomes = budget.incomes.filter(income => income.date.startsWith(month));
    const filteredExpenses = budget.expenses.filter(expense => expense.date.startsWith(month));

    // Aggiunge le entrate al riepilogo mensile
    filteredIncomes.forEach(income => {
        const row = budgetSummary.insertRow();
        row.insertCell(0).innerText = 'Entrata';
        row.insertCell(1).innerText = income.source;
        row.insertCell(2).innerText = income.category;
        row.insertCell(3).innerText = income.amount.toFixed(2);
        row.insertCell(4).innerText = income.date;
        row.insertCell(5).innerText = income.user;
        const actionsCell = row.insertCell(6);
        actionsCell.innerHTML = '<button onclick="editIncome(' + (budget.incomes.indexOf(income)) + ')">Modifica</button>';
        userIncomeTotal[income.user] += income.amount; // Totale per utente
    });

    // Aggiunge le uscite al riepilogo mensile
    filteredExpenses.forEach(expense => {
        const row = budgetSummary.insertRow();
        row.insertCell(0).innerText = 'Uscita';
        row.insertCell(1).innerText = expense.description;
        row.insertCell(2).innerText = expense.category;
        row.insertCell(3).innerText = expense.amount.toFixed(2);
        row.insertCell(4).innerText = expense.date;
        row.insertCell(5).innerText = expense.user;
        const actionsCell = row.insertCell(6);
        actionsCell.innerHTML = '<button onclick="editExpense(' + (budget.expenses.indexOf(expense)) + ')">Modifica</button>';
        userExpenseTotal[expense.user] += expense.amount; // Totale per utente
    });

    // Aggiunge tutte le entrate al riepilogo totale
    budget.incomes.forEach(income => {
        const row = totalBudgetSummary.insertRow();
        row.insertCell(0).innerText = 'Entrata';
        row.insertCell(1).innerText = income.source;
        row.insertCell(2).innerText = income.category;
        row.insertCell(3).innerText = income.amount.toFixed(2);
        row.insertCell(4).innerText = income.date;
        row.insertCell(5).innerText = income.user;
    });

    // Aggiunge tutte le uscite al riepilogo totale
    budget.expenses.forEach(expense => {
        const row = totalBudgetSummary.insertRow();
        row.insertCell(0).innerText = 'Uscita';
        row.insertCell(1).innerText = expense.description;
        row.insertCell(2).innerText = expense.category;
        row.insertCell(3).innerText = expense.amount.toFixed(2);
        row.insertCell(4).innerText = expense.date;
        row.insertCell(5).innerText = expense.user;
    });

    // Aggiorna il totale per categoria
    const categoryTotals = {};
    filteredExpenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });
    for (const category in categoryTotals) {
        const row = categorySummary.insertRow();
        row.insertCell(0).innerText = category;
        row.insertCell(1).innerText = categoryTotals[category].toFixed(2);
    }

    // Aggiorna il riepilogo totale per utente
    document.getElementById('total-income-alessio').innerText = userIncomeTotal['Alessio'].toFixed(2);
    document.getElementById('total-expense-alessio').innerText = userExpenseTotal['Alessio'].toFixed(2);
    document.getElementById('total-income-giulia').innerText = userIncomeTotal['Giulia'].toFixed(2);
    document.getElementById('total-expense-giulia').innerText = userExpenseTotal['Giulia'].toFixed(2);

    // Aggiorna il mese e l'anno nel riepilogo mensile
    const [year, monthNumber] = month.split('-');
    const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    document.getElementById('current-month-year').innerText = `${monthNames[parseInt(monthNumber) - 1]} ${year}`;
}

// Funzione per modificare un'entrata
function editIncome(index) {
    const income = budget.incomes[index];
    document.getElementById('income-user').value = income.user;
    document.getElementById('income-category').value = income.category;
    document.getElementById('income-source').value = income.source;
    document.getElementById('income-amount').value = income.amount;
    document.getElementById('income-date').value = income.date;
    editingIncomeIndex = index; // Imposta l'indice per la modifica
}

// Funzione per modificare un'uscita
function editExpense(index) {
    const expense = budget.expenses[index];
    document.getElementById('expense-user').value = expense.user;
    document.getElementById('expense-category').value = expense.category;
    document.getElementById('expense-description').value = expense.description;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-date').value = expense.date;
    editingExpenseIndex = index; // Imposta l'indice per la modifica
}
