
class BudgetManager {
  constructor() {
    this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    this.initializeEventListeners();
    this.updateDisplay();
  }

  initializeEventListeners() {
    const form = document.getElementById('transaction-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTransaction();
    });
  }

  addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (!description || !amount || !type) {
      alert('すべてのフィールドを入力してください!!');
      return;
    }

    const transaction = {
      id: Date.now(),
      description,
      amount,
      type,
      date: new Date().toLocaleDateString('ja-JP')
    };

    this.transactions.unshift(transaction);
    this.saveToLocalStorage();
    this.updateDisplay();
    this.clearForm();
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.saveToLocalStorage();
    this.updateDisplay();
  }

  calculateTotals() {
    const income = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  }

  updateDisplay() {
    this.updateSummary();
    this.updateTransactionsList();
  }

  updateSummary() {
    const { income, expense, balance } = this.calculateTotals();
    
    document.getElementById('total-income').textContent = `¥${income.toLocaleString()}`;
    document.getElementById('total-expense').textContent = `¥${expense.toLocaleString()}`;
    document.getElementById('balance').textContent = `¥${balance.toLocaleString()}`;

    // 残高の色を変更
    const balanceElement = document.getElementById('balance').parentElement;
    if (balance >= 0) {
      balanceElement.className = balanceElement.className.replace('bg-red-500', 'bg-blue-500');
    } else {
      balanceElement.className = balanceElement.className.replace('bg-blue-500', 'bg-red-500');
    }
  }

  updateTransactionsList() {
    const container = document.getElementById('transactions-list');
    
    if (this.transactions.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center">取引がありません</p>';
      return;
    }

    container.innerHTML = this.transactions.map(transaction => `
      <div class="flex justify-between items-center p-4 border-l-4 ${
        transaction.type === 'income' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
      } rounded-r-md">
        <div class="flex-1">
          <div class="font-semibold">${transaction.description}</div>
          <div class="text-sm text-gray-600">${transaction.date}</div>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-bold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }">
            ${transaction.type === 'income' ? '+' : '-'}¥${transaction.amount.toLocaleString()}
          </span>
          <button onclick="budgetManager.deleteTransaction(${transaction.id})" 
                  class="text-red-500 hover:text-red-700 font-bold text-lg">
            ×
          </button>
        </div>
      </div>
    `).join('');
  }

  saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('type').value = '';
  }
}

// アプリケーションを初期化
const budgetManager = new BudgetManager();
