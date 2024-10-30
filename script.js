
// Вход
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const rememberMe = document.getElementById('rememberMe');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername && savedPassword) {
        username.value = savedUsername;
        password.value = savedPassword;
        rememberMe.checked = true;
    }

    function preventLeadingSpaces(event) {
        if (event.target.value.length === 0 && event.key === ' ') {
            event.preventDefault();
        }
    }

    function validateUsername() {
        const value = username.value;
        const regex = /^[a-zA-Z]{6,}$/;
        
        if (!regex.test(value)) {
            usernameError.textContent = 'Логин должен содержать минимум 6 латинских букв без пробелов и цифр.';
            return false;
        } else {
            usernameError.textContent = '';
            return true;
        }
    }

    function validatePassword() {
        const value = password.value;
        const regex = /^[a-zA-Z0-9]{6,}$/;
        
        if (!regex.test(value)) {
            passwordError.textContent = 'Пароль должен содержать минимум 6 символов без пробелов.';
            return false;
        } else {
            passwordError.textContent = '';
            return true;
        }
    }

    username.addEventListener('keypress', preventLeadingSpaces);
    password.addEventListener('keypress', preventLeadingSpaces);

    username.addEventListener('input', validateUsername);
    password.addEventListener('input', validatePassword);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateUsername() && validatePassword()) {
            if (rememberMe.checked) {

                localStorage.setItem('username', username.value);
                localStorage.setItem('password', password.value);
            } else {
                
                localStorage.removeItem('username');
                localStorage.removeItem('password');
            }

            window.location.href = 'income.html';
        }
    });
});

// Страница доходы
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addButton');
    const tableBody = document.getElementById('tableBody');
    const totalSumElement = document.getElementById('totalSum');
    const sortSelect = document.getElementById('sortSelect');
    const datePicker = document.getElementById('datePicker');
    const filterButton = document.getElementById('filterButton');

    loadRecords();

    addButton.addEventListener('click', function() {
        const name = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const unit = document.getElementById('itemUnit').value;
        const quantity = parseInt(document.getElementById('itemQuantity').value);
        const price = parseFloat(document.getElementById('itemPrice').value);

        if (name && category && unit && !isNaN(quantity) && !isNaN(price)) {
            const total = quantity * price;
            const record = { name, category, unit, quantity, price, total };


            if (!isDuplicate(record)) {

                saveRecord(record);


                addRowToTable(record);
                updateTotal(total);

                clearInputFields();
            } else {
                alert("Этот доход уже существует.");
            }
        }
    });

    filterButton.addEventListener('click', function() {
        applyFilter();
    });

    sortSelect.addEventListener('change', function() {
        sortRecords(sortSelect.value);
    });

    function isDuplicate(newRecord) {
        let records = JSON.parse(localStorage.getItem('incomeRecords')) || [];
        return records.some(record => 
            record.name === newRecord.name &&
            record.category === newRecord.category &&
            record.unit === newRecord.unit &&
            record.quantity === newRecord.quantity &&
            record.price === newRecord.price
        );
    }

    function addRowToTable(record) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${Date.now()}</td>
            <td>${record.name}</td>
            <td>${record.category}</td>
            <td>${record.unit}</td>
            <td>${record.quantity}</td>
            <td>${record.price} р.</td>
            <td>${record.total} р.</td>
            <td><button class='edit-button'>Редактировать</button> 
                <button class='delete-button'>Удалить</button></td>`;
        
        tableBody.appendChild(row);

        row.querySelector('.edit-button').addEventListener('click', () => editRow(row));
        row.querySelector('.delete-button').addEventListener('click', () => deleteRow(row, record.total));
    }

    function saveRecord(record) {
        let records = JSON.parse(localStorage.getItem('incomeRecords')) || [];
        records.push(record);
        localStorage.setItem('incomeRecords', JSON.stringify(records));
    }

    function loadRecords() {
        let records = JSON.parse(localStorage.getItem('incomeRecords')) || [];
        let totalSum = 0;
        records.forEach(record => {
            addRowToTable(record);
            totalSum += record.total;
        });
        totalSumElement.textContent = totalSum; 
    }

    function updateTotal(newTotal) {
        let currentTotal = parseFloat(totalSumElement.textContent) || 0;
        currentTotal += newTotal; 
        totalSumElement.textContent = currentTotal; 
        localStorage.setItem('totalSum', currentTotal);
    }

    function clearInputFields() {
        document.getElementById('itemName').value = '';
        document.getElementById('itemCategory').value = '';
        document.getElementById('itemUnit').value = '';
        document.getElementById('itemQuantity').value = '';
        document.getElementById('itemPrice').value = '';
    }

    function editRow(row) {
        const cells = row.children;


        document.getElementById('itemName').value = cells[1].textContent;
        document.getElementById('itemCategory').value = cells[2].textContent;
        document.getElementById('itemUnit').value = cells[3].textContent;
        document.getElementById('itemQuantity').value = cells[4].textContent;
        document.getElementById('itemPrice').value = cells[5].textContent.replace(" р.", ""); 


        deleteRow(row, parseFloat(cells[6].textContent.replace(" р.", "")));


        addButton.textContent = "Сохранить";

        addButton.onclick = function() {
            const name = document.getElementById('itemName').value;
            const category = document.getElementById('itemCategory').value;
            const unit = document.getElementById('itemUnit').value;
            const quantity = parseInt(document.getElementById('itemQuantity').value);
            const price = parseFloat(document.getElementById('itemPrice').value);

            if (name && category && unit && !isNaN(quantity) && !isNaN(price)) {
                const total = quantity * price;
                const updatedRecord = { name, category, unit, quantity, price, total };


                saveRecord(updatedRecord);


                row.innerHTML = `
                    <td>${Date.now()}</td>
                    <td>${updatedRecord.name}</td>
                    <td>${updatedRecord.category}</td>
                    <td>${updatedRecord.unit}</td>
                    <td>${updatedRecord.quantity}</td>
                    <td>${updatedRecord.price} р.</td>
                    <td>${updatedRecord.total} р.</td>
                    <td><button class='edit-button'>Редактировать</button> 
                        <button class='delete-button'>Удалить</button></td>`;
                
                updateTotal(total); 

                clearInputFields();

   
                addButton.textContent = "ДОБАВИТЬ";

  
                row.querySelector('.edit-button').addEventListener('click', () => editRow(row));
                row.querySelector('.delete-button').addEventListener('click', () => deleteRow(row, updatedRecord.total));

                return; 
            } 

            addButton.textContent = "ДОБАВИТЬ"; 
        };
    }

    function deleteRow(row, total) {
       row.remove(); 
        
       let records = JSON.parse(localStorage.getItem('incomeRecords')) || [];
       

       records.splice(records.findIndex(r => r.total === total), 1); 
       localStorage.setItem('incomeRecords', JSON.stringify(records)); 

       updateTotal(-total); 

       recalculateTotals(); 
   }

   function recalculateTotals() {
       let records = JSON.parse(localStorage.getItem('incomeRecords')) || [];
       let newTotalSum = 0;

       records.forEach(record => {
           newTotalSum += record.total; 
       });

       totalSumElement.textContent = newTotalSum; 
   }
});


// Страница расходы
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addButton');
    const tableBody = document.getElementById('tableBody');
    const totalSumElement = document.getElementById('totalSum');


    loadRecords();

    addButton.addEventListener('click', function() {
        const name = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const unit = document.getElementById('itemUnit').value;
        const quantity = parseInt(document.getElementById('itemQuantity').value);
        const price = parseFloat(document.getElementById('itemPrice').value);

        if (name && category && unit && !isNaN(quantity) && !isNaN(price)) {
            const total = quantity * price;
            const record = { name, category, unit, quantity, price, total };

    
            saveRecord(record);

     
            addRowToTable(record);
            updateTotal(total);

        
            clearInputFields();
        } else {
            alert("Пожалуйста, заполните все поля корректно.");
        }
    });

    function addRowToTable(record) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${Date.now()}</td>
            <td>${record.name}</td>
            <td>${record.category}</td>
            <td>${record.unit}</td>
            <td>${record.quantity}</td>
            <td>${record.price} р.</td>
            <td>${record.total} р.</td>
            <td><button class='edit-button'>Редактировать</button> 
                <button class='delete-button'>Удалить</button></td>`;
        
        tableBody.appendChild(row);

    
        row.querySelector('.edit-button').addEventListener('click', () => editRow(row));
        row.querySelector('.delete-button').addEventListener('click', () => deleteRow(row, record.total));
    }

    function saveRecord(record) {
        let records = JSON.parse(localStorage.getItem('expenseRecords')) || [];
        records.push(record);
        localStorage.setItem('expenseRecords', JSON.stringify(records));
    }

    function loadRecords() {
        let records = JSON.parse(localStorage.getItem('expenseRecords')) || [];
        let totalSum = 0;
        records.forEach(record => {
            addRowToTable(record);
            totalSum += record.total;
        });
        totalSumElement.textContent = totalSum;
    }

    function updateTotal(newTotal) {
        let currentTotal = parseFloat(totalSumElement.textContent) || 0;
        currentTotal += newTotal; 
        totalSumElement.textContent = currentTotal; 
        localStorage.setItem('totalSum', currentTotal); 
    }

    function clearInputFields() {
        document.getElementById('itemName').value = '';
        document.getElementById('itemCategory').value = '';
        document.getElementById('itemUnit').value = '';
        document.getElementById('itemQuantity').value = '';
        document.getElementById('itemPrice').value = '';
    }

    function editRow(row) {
        const cells = row.children;
        

        document.getElementById('itemName').value = cells[1].textContent;
        document.getElementById('itemCategory').value = cells[2].textContent;
        document.getElementById('itemUnit').value = cells[3].textContent;
        document.getElementById('itemQuantity').value = cells[4].textContent;
        document.getElementById('itemPrice').value = cells[5].textContent.replace(" р.", ""); // Remove currency symbol

        
        deleteRow(row, parseFloat(cells[6].textContent.replace(" р.", "")));
        
        
        addButton.textContent = "Сохранить";
        
      rd
        addButton.onclick = function() {
            const name = document.getElementById('itemName').value;
            const category = document.getElementById('itemCategory').value;
            const unit = document.getElementById('itemUnit').value;
            const quantity = parseInt(document.getElementById('itemQuantity').value);
            const price = parseFloat(document.getElementById('itemPrice').value);
            
            if (name && category && unit && !isNaN(quantity) && !isNaN(price)) {
                const total = quantity * price;
                const updatedRecord = { name, category, unit, quantity, price, total };

                
                saveRecord(updatedRecord);

                
                row.innerHTML = `
                    <td>${Date.now()}</td>
                    <td>${updatedRecord.name}</td>
                    <td>${updatedRecord.category}</td>
                    <td>${updatedRecord.unit}</td>
                    <td>${updatedRecord.quantity}</td>
                    <td>${updatedRecord.price} р.</td>
                    <td>${updatedRecord.total} р.</td>
                    <td><button class='edit-button'>Редактировать</button> 
                        <button class='delete-button'>Удалить</button></td>`;
                
                updateTotal(total);

               
                clearInputFields();
                
             
                addButton.textContent = "ДОБАВИТЬ";
                
               
                row.querySelector('.edit-button').addEventListener('click', () => editRow(row));
                row.querySelector('.delete-button').addEventListener('click', () => deleteRow(row, updatedRecord.total));
                
                return; 
            } 
            
            addButton.textContent = "ДОБАВИТЬ"; 
        };
    }

    function deleteRow(row, total) {
        row.remove();
        
        let records = JSON.parse(localStorage.getItem('expenseRecords')) || [];
        

       records.splice(records.findIndex(r => r.total === total), 1); 
       localStorage.setItem('expenseRecords', JSON.stringify(records)); 

       updateTotal(-total); 
   }
});


// Калькулятор
document.addEventListener('DOMContentLoaded', function() {
    const incomeInput = document.querySelector('input[name="a"]');
    const expensesInput = document.querySelector('input[name="b"]');
    const taxResult = document.querySelector('.result__tax');
    const radioButtons = document.querySelectorAll('input[name="type"]');
    const resetButton = document.querySelector('.calc__btn-reset');

    // Функция для расчета налога
    function calculateTax() {
        const income = parseFloat(incomeInput.value);
        const expenses = parseFloat(expensesInput.value);
        
        // Проверка на отрицательные значения
        if (income < 0 || expenses < 0) {
            taxResult.textContent = '0';
            return;
        }

        const selectedTaxRate = Array.from(radioButtons).find(radio => radio.checked);
        const taxRate = selectedTaxRate ? parseFloat(selectedTaxRate.nextElementSibling.textContent) / 100 : 0;

        // Расчет налога
        const taxableIncome = income - expenses;
        if (taxableIncome <= 0) {
            taxResult.textContent = '0';
            return;
        }

        const tax = taxableIncome * taxRate;
        taxResult.textContent = tax.toFixed(2); // Форматируем до двух знаков после запятой
    }

    // Обработчик события для ввода в поля
    incomeInput.addEventListener('input', calculateTax);
    expensesInput.addEventListener('input', calculateTax);

    // Обработчик события для выбора радиокнопок
    radioButtons.forEach(radio => {
        radio.addEventListener('change', calculateTax);
    });

    // Обработчик события для кнопки очистки
    resetButton.addEventListener('click', function() {
        incomeInput.value = '';
        expensesInput.value = '';
        taxResult.textContent = '0'; // Сбрасываем результат налога
        radioButtons[0].checked = true; // Устанавливаем радиокнопку по умолчанию на 6%
    });
});

// Диаграммы
document.addEventListener('DOMContentLoaded', function() {
    const incomeRecords = JSON.parse(localStorage.getItem('incomeRecords')) || [];
    const expenseRecords = JSON.parse(localStorage.getItem('expenseRecords')) || [];

    const totalIncome = incomeRecords.reduce((sum, record) => sum + record.total, 0);
    const totalExpenses = expenseRecords.reduce((sum, record) => sum + record.total, 0);


    const data = {
        labels: ['Доходы', 'Расходы'],
        datasets: [{
            label: 'Сумма (р.)',
            data: [totalIncome, totalExpenses],
            backgroundColor: [
                'rgba(128, 128, 128, 0.6)', 
                'rgba(255, 215, 0, 0.6)'    
            ],
            borderColor: [
                'rgba(128, 128, 128, 1)', 
                'rgba(255, 215, 0, 1)'   
            ],
            borderWidth: 1
        }]
    };


    const config = {
        type: 'bar', 
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    const incomeExpenseChart = new Chart(
        document.getElementById('incomeExpenseChart'),
        config
    );
});
