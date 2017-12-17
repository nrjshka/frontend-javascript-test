"use strict";

// Ищет количество подряд вхождений символов s1 и s2 независимо от регистра
const dscount = (input, s1, s2) => {
    input = input.toLowerCase();
    
    let count = 0;
    for (let i = 0; i < input.length - 1; i++){
        if ((input[i] == s1) && (input[i+1] == s2))
            count++;
    }

    return count;
}

// Проверяет корректность скобочной структуры
const checkSyntax = (input) => {
    // Маска состояния для удобной проверки скобки
    let checkMask = {"{": "}", "[" : "]", "(" : ")", "<" : ">"};
    let queue = [];

    for (let i = 0; i < input.length; i++){
        if (["<", "[", "{", "("].includes(input[i])){
            // Пушим открывающиеся скобки
            queue.push(input[i]);
        }else {
            if ([">", "]", "}", ")"].includes(input[i])){
                // Если нашли закрывающаюся скобку, 
                // то нам нужно сравнить ее с последней в очереди
                
                if (queue){
                    if ( checkMask[queue[queue.length - 1]] != input[i] )
                        return 1;
                    else
                        queue.pop();
                }else {
                    return 1
                }
            }
        }
    }

    return queue ? 0 : 1;
}

/*
    Алгоритм:
    Нам всегда выгоднее жарить те блинчики, у которых минимальное число прожариваний.
    Соответственно ищем такой блинчик для каждой плиты и начинаем жарить.
*/

/* 
    Класс - Pancake.
    Поля: 
        - status - отвечает за количество прожаренных сторон
    Методы:
        - isCooking - готовиться ли в данный момент этот блин или нет
        - isReady - готов блин или нет
        - Cook - "положить блин на плиту" или "снять блин с плиты"
*/

class Pancake {
    constructor(){
        this.status = 0;
        this.cooking = false;
    }

    isCooking(){
        return this.cooking;
    }

    getStatus(){
        return this.status;
    }

    Cook(status = true){
        this.cooking = status;
        if (status)
            this.status += 1;
    }
}

/*
    Класс - Plate.
    Методы:
        - MakePancake - принимает на вход блин и пытается его приготовить.
                        В качестве результата своей работы возвращает следующие коды:
                            0 - блин готов
                            1 - жарим блин
                            2 - блин нельзя пожарить, потому что он жарится
*/

class Plate {
    MakePancake(cake){
        if (cake.isCooking())
            return 2;
        
        if (cake.getStatus() == 2)
            return 0;
        
        cake.Cook();

        return 1;
    }
}

// Запускает готовку, возвращает количество итераций для определенного числа блинов и плит
const startCooking = (countOfPancakes = 2, countOfPlates = 2) => {
    // Инициализируем блины и плиты
    let pancakes = [];
    let plates = [];

    for (let i = 0; i < countOfPancakes; i++)
        pancakes.push(new Pancake(0))


    for (let i = 0; i < countOfPlates; i++)
        plates.push(new Plate())

    let iteration = 0;
    let code = 0;
    
    // Если у нас есть блины
    if (countOfPancakes > 0){
        do{
            code = 0;
        
            // Ставим блины на плиту
            for (let i = 0; i < plates.length; i++){
                // Ищем минимальное число прожариваний
                let min = 0;

                for (let j = 1; j < pancakes.length; j++){
                    if (pancakes[j].getStatus() < pancakes[min].getStatus())
                        min = j; 
                }
                
                let saveCode = plates[i].MakePancake(pancakes[min])

                code += saveCode;
            }
            
            
            iteration += 1;

            // "Снимаем" блины с плиты
            for (let i = 0; i < pancakes.length; i++)
                pancakes[i].Cook(false);

        }while(code != 0)
    }else 
        throw "No pancakes!";

    return iteration - 1;
}

// Рефакторинг.

// Задача №1
function maxPositionOfChar(input, a, b) {
    for (let i = input.length - 1; i >= 0; i--){
        if ((input[i] == a) || (input[i] == b))
            return i;
    }

    return -1;
}

// Задача №2
function drawRating(vote) {
    vote = Math.ceil(vote / 20);
    
    if (vote == 0)
        return 1;
    return vote;
}

// Практические задачи

// Задача №1
const parseUrl = (input) => {
    return new URL(input);
}

//Задача №2