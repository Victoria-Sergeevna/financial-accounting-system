document.getElementById('openFormButton').addEventListener('click', function() {
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('closeFormButton').addEventListener('click', function() {
    document.getElementById('loginForm').style.display = 'none';
});

// Открытие модального окна
document.getElementById('openModal').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block';
});

// Закрытие модального окна
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

// Добавление новой записи в таблицу
document.getElementById('recordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

    const itemName = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const unit = document.getElementById('unit').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    // Получаем тело таблицы
    const tableBody = document.getElementById('tableBody');
    
    // Создаем новую строку
    const newRow = tableBody.insertRow();
    
    // Заполняем ячейки новой строки
    newRow.innerHTML = `
        <td>${tableBody.rows.length + 1}</td> 
        <td>${itemName}</td> 
        <td>${category}</td> 
        <td>${unit}</td> 
        <td>${quantity}</td> 
        <td>${price}</td>`;
    
    // Закрытие модального окна
    document.getElementById('modal').style.display = 'none';

    // Очистка формы
    this.reset();
});

// Обработка формы входа
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

    // Здесь можно добавить проверку логина и пароля, если необходимо

    // Перенаправление на основную страницу
    window.location.href = 'index.html'; // Убедитесь, что путь к вашей основной странице правильный
});