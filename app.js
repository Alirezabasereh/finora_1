/* =========================
   FINORA APP
========================= */

/* =========================
   STATE
========================= */

const state = {

  currentPage: 'home',

  theme:
    localStorage.getItem('theme')
    || 'dark',

  transactions:
    JSON.parse(
      localStorage.getItem('transactions')
    ) || []

};

/* =========================
   DOM
========================= */

/* PAGES */

const pages =
document.querySelectorAll('.page');

const navItems =
document.querySelectorAll('.nav-item');

/* BALANCE */

const balanceAmount =
document.getElementById('balanceAmount');

const incomeAmount =
document.getElementById('incomeAmount');

const expenseAmount =
document.getElementById('expenseAmount');

/* TRANSACTIONS */

const transactionsContainer =
document.getElementById(
  'transactionsContainer'
);

/* MODAL */

const transactionModal =
document.getElementById(
  'transactionModal'
);

const openModalBtn =
document.getElementById(
  'openModalBtn'
);

const closeModalBtn =
document.getElementById(
  'closeModalBtn'
);

const saveTransactionBtn =
document.getElementById(
  'saveTransactionBtn'
);

/* FORM */

const transactionAmount =
document.getElementById(
  'transactionAmount'
);

const transactionNote =
document.getElementById(
  'transactionNote'
);

const typeButtons =
document.querySelectorAll('.type-btn');

const categoryButtons =
document.querySelectorAll('.category-btn');

/* THEME */

const themeToggle =
document.getElementById(
  'themeToggle'
);

/* AI */

const aiInput =
document.getElementById('aiInput');

const sendAiBtn =
document.getElementById('sendAiBtn');

const aiChatBox =
document.getElementById('aiChatBox');

/* ANALYTICS */

const analyticsPieChart =
document.getElementById(
  'analyticsPieChart'
);

const analyticsInsight =
document.getElementById(
  'analyticsInsight'
);

const weeklyChart =
document.getElementById(
  'weeklyChart'
);

/* BUDGET */

const budgetContainer =
document.getElementById(
  'budgetContainer'
);

/* =========================
   APP VARIABLES
========================= */

let currentType = 'expense';

let currentCategory = 'food';

/* =========================
   INIT
========================= */

function init(){

  setupTheme();

  renderAll();

  setupNavigation();

  setupModal();

  setupTransactionType();

  setupCategories();

  setupSaveTransaction();

  setupThemeToggle();

  setupAI();

}

init();

/* =========================
   NAVIGATION
========================= */

function setupNavigation(){

  navItems.forEach((item) => {

    item.addEventListener('click', () => {

      const page =
      item.dataset.nav;

      state.currentPage = page;

      /* NAV ACTIVE */

      navItems.forEach((nav) => {

        nav.classList.remove('active');

      });

      item.classList.add('active');

      /* PAGE ACTIVE */

      pages.forEach((pageItem) => {

        pageItem.classList.remove(
          'active-page'
        );

      });

      document
        .querySelector(
          `[data-page="${page}"]`
        )
        .classList.add('active-page');

    });

  });

}

/* =========================
   MODAL
========================= */

function setupModal(){

  openModalBtn.addEventListener(
    'click',
    () => {

      transactionModal.classList.add(
        'active-modal'
      );

    }
  );

  closeModalBtn.addEventListener(
    'click',
    closeModal
  );

  transactionModal.addEventListener(
    'click',
    (e) => {

      if(
        e.target === transactionModal
      ){

        closeModal();

      }

    }
  );

}

function closeModal(){

  transactionModal.classList.remove(
    'active-modal'
  );

}

/* =========================
   TRANSACTION TYPE
========================= */

function setupTransactionType(){

  typeButtons.forEach((btn) => {

    btn.addEventListener('click', () => {

      typeButtons.forEach((button) => {

        button.classList.remove(
          'active'
        );

      });

      btn.classList.add('active');

      currentType =
      btn.dataset.type;

    });

  });

}

/* =========================
   CATEGORIES
========================= */

function setupCategories(){

  categoryButtons.forEach((btn) => {

    btn.addEventListener('click', () => {

      categoryButtons.forEach((button) => {

        button.classList.remove(
          'active'
        );

      });

      btn.classList.add('active');

      currentCategory =
      btn.dataset.category;

    });

  });

}

/* =========================
   SAVE TRANSACTION
========================= */

function setupSaveTransaction(){

  saveTransactionBtn.addEventListener(
    'click',
    saveTransaction
  );

}

function saveTransaction(){

  const amount =
  Number(transactionAmount.value);

  const note =
  transactionNote.value.trim();

  if(!amount || amount <= 0){

    alert('مبلغ معتبر وارد کن');

    return;

  }

  const transaction = {

    id: crypto.randomUUID(),

    amount,

    note,

    category: currentCategory,

    type: currentType,

    createdAt: Date.now()

  };

  state.transactions.unshift(
    transaction
  );

  persistTransactions();

  renderAll();

  resetForm();

  closeModal();

}

/* =========================
   RESET FORM
========================= */

function resetForm(){

  transactionAmount.value = '';

  transactionNote.value = '';

  currentType = 'expense';

  currentCategory = 'food';

}

/* =========================
   STORAGE
========================= */

function persistTransactions(){

  localStorage.setItem(
    'transactions',
    JSON.stringify(
      state.transactions
    )
  );

}

/* =========================
   RENDER ALL
========================= */

function renderAll(){

  renderDashboard();

  renderTransactions();

  renderAnalytics();

  renderBudgets();

  renderAI();

}

/* =========================
   DASHBOARD
========================= */

function renderDashboard(){

  const income =
  state.transactions
    .filter((t) =>
      t.type === 'income'
    )
    .reduce((acc, item) => {

      return acc + item.amount;

    }, 0);

  const expense =
  state.transactions
    .filter((t) =>
      t.type === 'expense'
    )
    .reduce((acc, item) => {

      return acc + item.amount;

    }, 0);

  const balance =
  income - expense;

  balanceAmount.innerHTML =
  `${formatMoney(balance)} تومان`;

  incomeAmount.innerHTML =
  formatMoney(income);

  expenseAmount.innerHTML =
  formatMoney(expense);

}

/* =========================
   TRANSACTIONS
========================= */

function renderTransactions(){

  if(
    state.transactions.length === 0
  ){

    transactionsContainer.innerHTML =

    `
      <div class="empty-state">

        <i class="fa-solid fa-wallet"></i>

        <h3>
          هنوز تراکنشی نداری
        </h3>

      </div>
    `;

    return;

  }

  transactionsContainer.innerHTML = '';

  state.transactions.forEach(
    (transaction) => {

      const item =
      document.createElement('div');

      item.classList.add(
        'transaction-item'
      );

      const icon =
      transaction.type === 'income'
      ? 'fa-arrow-trend-up'
      : 'fa-arrow-trend-down';

      item.innerHTML =

      `
        <div class="transaction-left">

          <div class="
            transaction-icon
            ${transaction.type}
          ">

            <i class="
              fa-solid
              ${icon}
            "></i>

          </div>

          <div>

            <h4>
              ${translateCategory(
                transaction.category
              )}
            </h4>

            <p>
              ${
                transaction.note ||
                'بدون توضیح'
              }
            </p>

          </div>

        </div>

        <div class="transaction-right">

          <h3>

            ${
              transaction.type ===
              'income'
              ? '+'
              : '-'
            }

            ${formatMoney(
              transaction.amount
            )}

          </h3>

          <button
            onclick="
              deleteTransaction(
                '${transaction.id}'
              )
            "
          >

            <i class="
              fa-solid fa-trash
            "></i>

          </button>

        </div>
      `;

      transactionsContainer.appendChild(
        item
      );

    });

}

/* =========================
   DELETE
========================= */

function deleteTransaction(id){

  state.transactions =
  state.transactions.filter(
    (transaction) => {

      return transaction.id !== id;

    }
  );

  persistTransactions();

  renderAll();

}

/* =========================
   ANALYTICS
========================= */

function renderAnalytics(){

  const expenseTransactions =
  state.transactions.filter(
    (transaction) => {

      return transaction.type ===
      'expense';

    }
  );

  const categoryTotals = {

    food: 0,

    transport: 0,

    shopping: 0,

    fun: 0,

    other: 0

  };

  expenseTransactions.forEach(
    (transaction) => {

      if(
        categoryTotals[
          transaction.category
        ] !== undefined
      ){

        categoryTotals[
          transaction.category
        ] += transaction.amount;

      }

    }
  );

  const totalExpenses =
  Object.values(
    categoryTotals
  ).reduce((a, b) => a + b, 0);

  /* PIE */

  analyticsPieChart.innerHTML =

  `
    <div class="pie-chart">

      <div class="pie-center">

        <h2>
          ${
            totalExpenses > 0
            ? '100%'
            : '0%'
          }
        </h2>

        <p>
          هزینه‌ها
        </p>

      </div>

    </div>
  `;

  /* INSIGHT */

  analyticsInsight.innerHTML =

  `
    <div class="insight-icon">

      <i class="
        fa-solid fa-sparkles
      "></i>

    </div>

    <div>

      <h3>
        تحلیل هوشمند
      </h3>

      <p>

        ${
          totalExpenses > 0
          ? `
            بیشترین هزینه شما در
            دسته
            ${
              translateCategory(
                getTopCategory(
                  categoryTotals
                )
              )
            }
            بوده.
          `
          : `
            هنوز داده‌ای برای
            تحلیل وجود ندارد.
          `
        }

      </p>

    </div>
  `;

  /* WEEKLY */

  renderWeeklyChart(
    expenseTransactions
  );

}

/* =========================
   WEEKLY CHART
========================= */

function renderWeeklyChart(
  transactions
){

  const days = [0,0,0,0,0,0,0];

  transactions.forEach((t) => {

    const day =
    new Date(
      t.createdAt
    ).getDay();

    days[day] += t.amount;

  });

  weeklyChart.innerHTML = '';

  days.forEach((amount) => {

    const bar =
    document.createElement('div');

    bar.classList.add('bar');

    const max =
    Math.max(...days, 1);

    const height =
    (amount / max) * 100;

    bar.innerHTML =

    `
      <div
        style="
          height:${height}%
        "
      ></div>
    `;

    weeklyChart.appendChild(bar);

  });

}

/* =========================
   BUDGETS
========================= */

function renderBudgets(){

  const budgets = {

    food: 10000000,

    transport: 5000000,

    shopping: 7000000,

    fun: 4000000

  };

  budgetContainer.innerHTML = '';

  Object.keys(budgets).forEach(
    (category) => {

      const spent =
      state.transactions
        .filter((t) => {

          return (
            t.category === category &&
            t.type === 'expense'
          );

        })
        .reduce((acc, item) => {

          return acc + item.amount;

        }, 0);

      const limit =
      budgets[category];

      const percent =
      Math.min(
        (spent / limit) * 100,
        100
      );

      const card =
      document.createElement('div');

      card.classList.add(
        'glass',
        'budget-card'
      );

      card.innerHTML =

      `
        <div class="budget-info">

          <h3>
            ${translateCategory(
              category
            )}
          </h3>

          <p>

            ${formatMoney(spent)}
            /

            ${formatMoney(limit)}

          </p>

        </div>

        <div class="budget-progress">

          <div
            class="budget-progress-fill"
            style="
              width:${percent}%
            "
          ></div>

        </div>

      `;

      budgetContainer.appendChild(
        card
      );

    });

}

/* =========================
   AI
========================= */

function renderAI(){

  aiChatBox.innerHTML =

  `
    <div class="ai-message">

      <div class="ai-avatar">

        <i class="
          fa-solid fa-brain
        "></i>

      </div>

      <div class="message-content">

        <h4>
          Finora AI
        </h4>

        <p>

          ${
            state.transactions.length
            ? `
              تا الان
              ${formatMoney(
                getTotalExpenses()
              )}
              تومان خرج کردی.
            `
            : `
              هنوز تراکنشی ثبت نکردی.
            `
          }

        </p>

      </div>

    </div>
  `;

}

/* =========================
   AI CHAT
========================= */

function setupAI(){

  sendAiBtn.addEventListener(
    'click',
    sendAIMessage
  );

}

function sendAIMessage(){

  const value =
  aiInput.value.trim();

  if(!value) return;

  const userMessage =
  document.createElement('div');

  userMessage.classList.add(
    'user-message'
  );

  userMessage.innerHTML =

  `
    <div class="message-content">

      <p>${value}</p>

    </div>
  `;

  aiChatBox.appendChild(
    userMessage
  );

  setTimeout(() => {

    const aiMessage =
    document.createElement('div');

    aiMessage.classList.add(
      'ai-message'
    );

    aiMessage.innerHTML =

    `
      <div class="ai-avatar">

        <i class="
          fa-solid fa-sparkles
        "></i>

      </div>

      <div class="message-content">

        <h4>
          Finora AI
        </h4>

        <p>

          مدیریت هزینه‌های روزانه
          و تعیین بودجه هفتگی
          بهترین راه کنترل مالیه ✨

        </p>

      </div>
    `;

    aiChatBox.appendChild(
      aiMessage
    );

    aiChatBox.scrollTop =
    aiChatBox.scrollHeight;

  }, 700);

  aiInput.value = '';

}

/* =========================
   THEME
========================= */

function setupTheme(){

  if(state.theme === 'light'){

    document.body.classList.add(
      'light-mode'
    );

    if(themeToggle){

      themeToggle.checked = false;

    }

  }

}

function setupThemeToggle(){

  if(!themeToggle) return;

  themeToggle.addEventListener(
    'change',
    () => {

      document.body.classList.toggle(
        'light-mode'
      );

      state.theme =
      document.body.classList.contains(
        'light-mode'
      )
      ? 'light'
      : 'dark';

      localStorage.setItem(
        'theme',
        state.theme
      );

    }
  );

}

/* =========================
   HELPERS
========================= */

function formatMoney(number){

  return Number(number)
    .toLocaleString('fa-IR');

}

function translateCategory(
  category
){

  const map = {

    food: 'خوراک',

    transport: 'حمل و نقل',

    shopping: 'خرید',

    fun: 'سرگرمی',

    salary: 'حقوق',

    other: 'سایر'

  };

  return map[category] || category;

}

function getTopCategory(obj){

  return Object.keys(obj).reduce(
    (a, b) => {

      return obj[a] > obj[b]
      ? a
      : b;

    }
  );

}

function getTotalExpenses(){

  return state.transactions
    .filter((t) => {

      return t.type === 'expense';

    })
    .reduce((acc, item) => {

      return acc + item.amount;

    }, 0);

}