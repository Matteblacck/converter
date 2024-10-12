// Получаем элементы из HTML
const convertBtn = document.querySelector('.convertBtn');
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from');
const toCurrency = document.getElementById('to');
const resultElement = document.querySelector('.result');

const API_KEY = '2955c784be4c41b917b9ad30fe1f474f'

convertBtn.addEventListener('click', convertCurrency)

async function convertCurrency() {
    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Проверка на корректность введённой суммы
    if (!amount || isNaN(amount)) {
        resultElement.textContent = 'Пожалуйста, введите корректную сумму.';
        return;
    }

    try {
        // Формируем URL с указанием базовой валюты и API-ключа
        const url = `https://api.exchangerate.host/live?access_key=${API_KEY}&currencies=${to}&source=${from}`;
        console.log(`Fetching data from: ${url}`);

        const response = await fetch(url);
        
        // Проверяем успешность ответа
        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            throw new Error('Ошибка при получении данных с сервера');
        }

        const data = await response.json();
        console.log(data); // Логируем полученные данные

        // Получаем курс обмена
        const rateKey = `${from}${to}`; // Формируем ключ для доступа к курсу
        const rate = data.quotes[rateKey]; // Получаем курс

        // Проверяем, есть ли курс для выбранной валюты
        if (!rate) {
            throw new Error(`Курс для валюты ${to} не найден.`);
        }

        const convertedAmount = (amount * rate).toFixed(2);
        resultElement.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
    } catch (error) {
        resultElement.textContent = 'Не удалось получить данные о курсе валют. Попробуйте позже.';
        console.error('Ошибка:', error);
    }
}