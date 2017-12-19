"use strict";

// Сохраняем данные о пользователях глобально
let users = {data: [], position: 0};

document.addEventListener("DOMContentLoaded", (event) => {
    // Привязываем кнопки и назначаем им обработчики 
    let btnSmall = document.getElementById('btn-small');
    let btnBig = document.getElementById('btn-big');

    btnSmall.addEventListener('click', start);
    btnBig.addEventListener('click', start);
});

async function start(event){
    // Инициализируем начальное состояние объектов
    let table = document.getElementsByClassName('table')[0];
    let askPanel = document.getElementsByClassName('ask')[0];
    let preload = document.getElementsByClassName('preload')[0];

    // Закрываем панель запроса и грузим таблицу ▼▲
    preload.style.display = "block"; askPanel.style.display = "none";

    let status = event.target.id == "btn-big" ? true : false;
    
    // Отправляем запрос на получение данных и проверяем статус
    let output = await parse(status);
    if (output){
        // Сохраняем данные глобально
        users.data = [...output];

        table.style.display = "table"; preload.style.display = "none";
        bindButtons();

        insertTable(0, 50);
    }else {
        // Если произошла какая-то ошибка, то возвращается к "заводским"
        preload.style.display = "none"; askPanel.style.display = "block";
        alert('Sorry, there was an error. Try later.');
    }
}

async function parse(status){
    let url = status ? 
            "http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}":
            "http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}";
    
    return await fetch(url)
          .then((response) => {return response.json()})
          .then((data) => {
              return data;
          })
          .catch(() => {
              // Произошла какая-то ошибка
              return false;
          })
}

// Вставляет данные в таблицу из users.data с ходом в value
function insertTable(from, to){
    let tbody = document.getElementsByTagName('tbody')[0];
    users.position = to;
    // Очищаем таблицу
    tbody.innerHTML = "";
    
    // Тут долго-вставка
    for (let i = from; i < to && i < users.data.length; i++){
        let tr = document.createElement('tr');

        // Id
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(users.data[i].id)); tr.appendChild(td);
        // Имя
        td = document.createElement('td');
        td.appendChild(document.createTextNode(users.data[i].firstName)); tr.appendChild(td);
        // Фамилия
        td = document.createElement('td');
        td.appendChild(document.createTextNode(users.data[i].lastName)); tr.appendChild(td);
        // Email
        td = document.createElement('td');
        td.appendChild(document.createTextNode(users.data[i].email)); tr.appendChild(td);
        // Телефон
        td = document.createElement('td');
        td.appendChild(document.createTextNode(users.data[i].phone)); tr.appendChild(td);

        tbody.appendChild(tr);
    }
}

// Определяет обработчики для кнопок
function bindButtons(){
    document.getElementById('id').addEventListener('click', sort);
    document.getElementById('firstName').addEventListener('click', sort);
    document.getElementById('lastName').addEventListener('click', sort);
    document.getElementById('email').addEventListener('click', sort);
    document.getElementById('phone').addEventListener('click', sort);
}

// Сортирует список объектов
function sort(event){
    let status = event.target.innerText == "▲" ? true : false;

    if (status){
        users.data.sort( (userA, userB) => {
            // Сортируем по возрастанию
            return userA[event.target.id] < userB[event.target.id] ? 1 : -1;
        })
        insertTable(users.position - 50, users.position);
    }else {
        users.data.sort((userA, userB) => {
            // Сортируем по убыванию
            return userA[event.target.id] > userB[event.target.id] ? 1 : -1;
        })
        insertTable(users.position - 50, users.position);
    }

    event.target.innerText = status ? "▼" : "▲";
}