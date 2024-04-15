// Змінна для зберігання індексу рейсу, який буде змінюватися
let editIndex = -1;

displayPassengers()


// Функція для показу вкладки
function showTab(tabId) {
    // Показуємо обрану вкладку, ховаємо інші
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.id === tabId) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });

    // Поновлюємо список рейсів при переході на вкладку зі списком
    if (tabId === 'listTab') {
        displayTrains();
    }
}

function createTrain() {
    const trainNameInput = document.getElementById('trainName');
    const capacityInput = document.getElementById('capacity');
    const departureDateTimeInput = document.getElementById('departureDateTime');
    const arrivalDateTimeInput = document.getElementById('arrivalDateTime');
    const ticketPriceInput = document.getElementById('ticketPrice');

    const trainName = trainNameInput.value.trim();
    const capacity = parseInt(capacityInput.value);
    const departureDateTime = departureDateTimeInput.value;
    const arrivalDateTime = arrivalDateTimeInput.value;
    const ticketPrice = parseFloat(ticketPriceInput.value);

    if (!trainName || isNaN(capacity) || capacity <= 0 || !departureDateTime || !arrivalDateTime || isNaN(ticketPrice) || ticketPrice <= 0) {
        alert('Будь ласка, заповніть усі поля коректно.');
        return;
    }

    const train = {
        name: trainName,
        capacity: capacity,
        departureDateTime: departureDateTime,
        arrivalDateTime: arrivalDateTime,
        ticketPrice: ticketPrice,
        delay: false
    };

    // Перевірка, чи ми змінюємо існуючий рейс
    if (editIndex !== -1) {
        updateTrain(train);
        editIndex = -1; // Скидаємо індекс рейсу для зміни
    } else {
        saveTrain(train);
    }

    // Очищення полів форми після створення або зміни рейсу
    trainNameInput.value = '';
    capacityInput.value = '';
    departureDateTimeInput.value = '';
    arrivalDateTimeInput.value = '';
    ticketPriceInput.value = '';

    // Показуємо вкладку зі списком рейсів після створення або зміни рейсу
    showTab('listTab');
}

function saveTrain(train) {
    let trains = JSON.parse(localStorage.getItem('trains')) || [];
    trains.push(train);
    localStorage.setItem('trains', JSON.stringify(trains));
}

function updateTrain(train) {
    let trains = JSON.parse(localStorage.getItem('trains')) || [];
    trains[editIndex] = train; // Замінюємо рейс з вказаним індексом
    localStorage.setItem('trains', JSON.stringify(trains));
}

function displayTrains() {
    const trainListContainer = document.getElementById('trainList');
    trainListContainer.innerHTML = '';

    const trains = JSON.parse(localStorage.getItem('trains')) || [];

    if (trains.length === 0) {
        trainListContainer.textContent = 'Немає даних про рейси.';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('train-table');

    // Заголовок таблиці
    const headerRow = table.createTHead().insertRow();
    headerRow.innerHTML = '<th>Назва поїзда</th><th>Кількість місць</th><th>Дата і час відправлення</th><th>Дата і час прибуття</th><th>Ціна за квиток</th><th>Запізнення</th><th>Дії</th>';

    // Додавання даних про рейси в таблицю
    const tbody = table.createTBody();
    trains.forEach((train, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `<td>${train.name}</td><td>${train.capacity}</td><td>${train.departureDateTime}</td><td>${train.arrivalDateTime}</td><td>${train.ticketPrice} грн</td><td>${train.delay ? 'Так' : 'Ні'}</td><td><button onclick="editTrain(${index})">Змінити</button> <button onclick="removeTrain(${index})">Видалити</button> <button onclick="bookTicketForm(${index})">Записати пасажирів</button></td>`;
    });

    trainListContainer.appendChild(table);
}

function removeTrain(index) {
    let trains = JSON.parse(localStorage.getItem('trains')) || [];
    trains.splice(index, 1);
    localStorage.setItem('trains', JSON.stringify(trains));
    displayTrains();
}

function editTrain(index) {
    let trains = JSON.parse(localStorage.getItem('trains')) || [];
    const train = trains[index];

    // Заповнюємо поля форми даними рейсу для зміни
    document.getElementById('trainName').value = train.name;
    document.getElementById('capacity').value = train.capacity;
    document.getElementById('departureDateTime').value = train.departureDateTime;
    document.getElementById('arrivalDateTime').value = train.arrivalDateTime;
    document.getElementById('ticketPrice').value = train.ticketPrice;

    // Встановлюємо індекс рейсу, який будемо змінювати
    editIndex = index;

    // Показуємо форму створення рейсу для зміни
    showTab('createTab');
}

function bookTicketForm(index) {
    // Встановлюємо індекс рейсу, на який будемо записувати пасажирів
    editIndex = index;

    // Показуємо форму для запису пасажирів на поїзд
    showTab('bookingForm');
}

// Змінна для зберігання списку зареєстрованих пасажирів
let passengers = [];

function registerPassenger() {
    const passengerNameInput = document.getElementById('passengerNameReg');
    const phoneInput = document.getElementById('phoneReg');
    const emailInput = document.getElementById('emailReg');
    const discountInput = document.getElementById('discountReg');

    const passengerName = passengerNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const discount = discountInput.value.trim().toUpperCase();

    if (!passengerName || !phone || !email) {
        alert('Будь ласка, заповніть усі обов\'язкові поля для реєстрації пасажира.');
        return;
    }

    // Перевірка формату номера пільги
    if (discount && !(discount.startsWith('FF') || discount.startsWith('SF'))) {
        alert('Номер пільги повинен починатися з FF або SF.');
        return;
    }

    // Генеруємо унікальний ідентифікатор для пасажира
    const passengerId = generateUUID();

    const passenger = {
        id: passengerId,
        name: passengerName,
        phone: phone,
        email: email,
        discount: discount
    };

    // Отримуємо список зареєстрованих пасажирів з localStorage (якщо він вже існує)
    let passengers = JSON.parse(localStorage.getItem('passengers')) || [];

    // Додаємо нового пасажира до списку
    passengers.push(passenger);

    // Зберігаємо оновлений список пасажирів у localStorage
    localStorage.setItem('passengers', JSON.stringify(passengers));

    // Очищення полів форми після реєстрації
    passengerNameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
    discountInput.value = '';

    alert(`Пасажир ${passengerName} був успішно зареєстрований з ID: ${passengerId}.`);
    displayPassengers();
}

// Функція для генерації UUID (унікального ідентифікатора)
function generateUUID() {
    // Генеруємо випадковий UUID за допомогою Math.random() і Date.now()
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Функція для відображення списку пасажирів у випадаючому меню
function populatePassengerSelect() {
    const passengerSelect = document.getElementById('passengerSelect');
    passengerSelect.innerHTML = ''; // Очищення вмісту випадаючого списку перед оновленням

    // Отримуємо список пасажирів з localStorage
    const passengers = JSON.parse(localStorage.getItem('passengers')) || [];

    // Додаємо кожного пасажира у випадаючий список
    passengers.forEach(passenger => {
        const option = document.createElement('option');
        option.value = passenger.id; // Використовуємо ідентифікатор пасажира як значення опції
        option.textContent = passenger.name; // Використовуємо ім'я пасажира як вміст опції
        passengerSelect.appendChild(option);
    });
}

// Функція для запису пасажира на поїзд
function bookTicket() {
    const passengerSelect = document.getElementById('passengerSelect');
    const selectedPassengerId = passengerSelect.value; // Отримуємо ідентифікатор обраного пасажира зі списку

    if (!selectedPassengerId) {
        alert('Будь ласка, оберіть пасажира зі списку.');
        return;
    }

    // Отримуємо список пасажирів з localStorage
    const passengers = JSON.parse(localStorage.getItem('passengers')) || [];

    // Знаходимо обраного пасажира за його ідентифікатором
    const selectedPassenger = passengers.find(passenger => passenger.id === selectedPassengerId);

    if (!selectedPassenger) {
        alert('Помилка: обраний пасажир не знайдений.');
        return;
    }

    // Отримуємо список поїздів з localStorage
    const trains = JSON.parse(localStorage.getItem('trains')) || [];

    // Знаходимо перший поїзд, на який можна записати пасажира
    const availableTrain = trains.find(train => train.capacity > 0);

    if (!availableTrain) {
        alert('На жаль, всі місця на всіх поїздах вже зайняті.');
        return;
    }

    // Записуємо інформацію про пасажира до першого знайденого вільного поїзда
    availableTrain.passengers = availableTrain.passengers || [];
    availableTrain.passengers.push(selectedPassenger.id);
    availableTrain.capacity--; // Зменшуємо кількість вільних місць у поїзді

    // Оновлюємо дані про поїзд у локальному сховищі
    localStorage.setItem('trains', JSON.stringify(trains));

    // Повідомлення про успішний запис
    alert(`Пасажир ${selectedPassenger.name} був успішно записаний на поїзд.`);

    // Оновлення відображення списку поїздів та пасажирів
    displayPassengerTrains();
}

// Виклик функції для заповнення випадаючого списку пасажирів при завантаженні сторінки
populatePassengerSelect();

// Функція для відображення списку зареєстрованих пасажирів
function displayPassengers() {
    const passengerListContainer = document.getElementById('passengerListContainer');
    passengerListContainer.innerHTML = ''; // Очищення контейнера перед вставкою нового вмісту

    const passengers = JSON.parse(localStorage.getItem('passengers')) || [];

    const table = document.createElement('table');
    table.classList.add('passenger-table');

    // Заголовок таблиці
    const headerRow = table.createTHead().insertRow();
    headerRow.innerHTML = '<th>Ім\'я</th><th>Номер телефону</th><th>Електронна пошта</th><th>Номер пільги</th><th>Дії</th>';

    // Додавання даних про пасажирів в таблицю
    const tbody = table.createTBody();
    passengers.forEach(passenger => {
        const row = tbody.insertRow();
        row.innerHTML = `<td>${passenger.name}</td><td>${passenger.phone}</td><td>${passenger.email}</td><td>${passenger.discount}</td>`;
        
        // Створення кнопки видалення для кожного пасажира
        const deleteButtonCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.addEventListener('click', () => {
            deletePassenger(passenger.id);
        });
        deleteButtonCell.appendChild(deleteButton);
    });

    passengerListContainer.appendChild(table);
}

function deletePassenger(passengerId) {
    // Отримуємо список пасажирів з localStorage
    let passengers = JSON.parse(localStorage.getItem('passengers')) || [];

    // Фільтруємо список пасажирів, видаляючи пасажира з відповідним ідентифікатором
    passengers = passengers.filter(passenger => passenger.id !== passengerId);

    // Оновлюємо список пасажирів у localStorage
    localStorage.setItem('passengers', JSON.stringify(passengers));

    // Повторно відображаємо список пасажирів після видалення
    displayPassengers();

    // Додайте будь-яке повідомлення або підтвердження, якщо потрібно
    alert('Пасажир був успішно видалений.');
}

document.addEventListener('DOMContentLoaded', function() {
    const trainsContainer = document.getElementById('trainsContainer');

    // Отримуємо список поїздів з localStorage
    const trains = JSON.parse(localStorage.getItem('trains')) || [];

    // Відображення кожного поїзда у вікні браузера
    trains.forEach(train => {
        const trainDetailsDiv = document.createElement('div');
        trainDetailsDiv.classList.add('train-details');

        const trainTitle = document.createElement('h3');
        trainTitle.textContent = train.name;

        const passengerList = document.createElement('ul');
        passengerList.classList.add('passenger-list');

        // Додаємо пасажирів до списку пасажирів поїзда
        if (train.passengers && Array.isArray(train.passengers)) {
            train.passengers.forEach(passengerId => {
                const passenger = getPassengerById(passengerId);
                if (passenger) {
                    const passengerItem = document.createElement('li');
                    passengerItem.textContent = passenger.name;
                    passengerList.appendChild(passengerItem);
                }
            });
        }

        // Додаємо список пасажирів до блоку деталей поїзда
        trainDetailsDiv.appendChild(trainTitle);
        trainDetailsDiv.appendChild(passengerList);

        // Додаємо обробник події для розгортання/згортання списку пасажирів
        trainTitle.addEventListener('click', function() {
            const isHidden = passengerList.style.display === 'none';
            passengerList.style.display = isHidden ? 'block' : 'none';
        });

        // Додаємо блок деталей поїзда до контейнера поїздів
        trainsContainer.appendChild(trainDetailsDiv);
    });

    // Функція для отримання інформації про пасажира за його ідентифікатором
    function getPassengerById(passengerId) {
        const passengers = JSON.parse(localStorage.getItem('passengers')) || [];
        return passengers.find(passenger => passenger.id === passengerId);
    }
});

// Відображення початкової вкладки
showTab('createTab');
