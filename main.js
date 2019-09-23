const stringModeEnum = { WRITE: 0, APPEND: 1 }
const errorCodeEnum = { NO_ERROR: 0, ERROR: 1 }
const operatorCharMap = {
    "+": "\u002B",
    "-": "\u2212",
    "*": "\u00D7",
    "/": "\u00F7",
    "\u002B": "+",
    "\u2212": "-",
    "\u00D7": "*",
    "\u00F7": "/",
}
var stack = [];
var hasInputStarted = true;


function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, op) {
    switch (op) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            if (b == 0)
                return "Cannot divide by zero‬";
            return divide(a, b);
    }
}

function isOperator(key) {
    return key == '+' || key == '-' || key == '*' || key == '/'
}

function isDigit(key) {
    return key.match(/^\d+$/);
}

function changeInput(str, mode, error = 0) {
    const inputDisplay = document.querySelector("#calc-input");
    if (error) {
        inputDisplay.innerHTML = str;   
    } else {
        str = (str == '') ? 0 : str;    
        inputDisplay.innerHTML = mode === stringModeEnum.APPEND ? inputDisplay.innerHTML + str : str;

        //remove leading zeros
        if (inputDisplay.innerHTML.match(/^0+\d/))
            inputDisplay.innerHTML = Number(inputDisplay.innerHTML);
    }
}

function updateExpression() {
    const expressionDisplay = document.querySelector("#calc-expression");
    expressionDisplay.innerHTML = stack.map((key) => isOperator(key) ? operatorCharMap[key] : key).join("");
}

function operatorPressedEventHandler(opString, opKey) {
    const inputDisplay = document.querySelector("#calc-input");
    if (hasInputStarted && isOperator(stack[stack.length - 1])) {
        stack[stack.length - 1] = opKey;
    } else {
        stack.push(Number(inputDisplay.innerHTML));
        stack.push(opKey);
        hasInputStarted = true;
    }
    updateExpression();
}

function equalPressedEventHandler() {
    const inputDisplay = document.querySelector("#calc-input");
    stack.push(Number(inputDisplay.innerHTML));
    updateExpression();
    processStack();
    hasInputStarted = true;
}

function numberPressedEventHandler(key) {
    const expressionDisplay = document.querySelector("#calc-expression");
    changeInput(key, hasInputStarted ? stringModeEnum.WRITE : stringModeEnum.APPEND);
    hasInputStarted = false;
}

function backspacePressedEventHandler() {
    const inputDisplay = document.querySelector("#calc-input");
    changeInput(inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 1), stringModeEnum.WRITE);
}

function keypressHandler(key) {
    const inputDisplay = document.querySelector("#calc-input");
    if (isDigit(key)) {
        numberPressedEventHandler(key);
    }
    else if (isOperator(key)) {
        operatorPressedEventHandler(operatorCharMap[key], key);
    }
    else if (key == "Enter") {
        equalPressedEventHandler();
    }
    else if (key == "Backspace") {
        backspacePressedEventHandler();
    }
}

function processStack() {
    let result = stack.shift();
    let key = stack.shift();
    let currentOperator;
    let error = errorCodeEnum.NO_ERROR;
    while (key != undefined) {
        if (typeof key == "number") {
            result = operate(result, key, currentOperator)
            if (typeof result != "number") {
                error = errorCodeEnum.ERROR;
                stack = [];
                break;
            }
        }
        else {
            currentOperator = key;
        }
        key = stack.shift();
    }
    changeInput(result, stringModeEnum.WRITE, error);
}

window.onload = (event) => {
    const inputDisplay = document.querySelector("#calc-input");
    const numButtons = Array.from(document.querySelectorAll(".number"));
    numButtons.forEach((element) => {
        element.onclick = () => numberPressedEventHandler(element.innerHTML);
    });

    const opButtons = Array.from(document.querySelectorAll(".operator"));
    opButtons.forEach((element) => {
        element.onclick = () => operatorPressedEventHandler(element.innerHTML, operatorCharMap[element.innerHTML]);
    });

    document.querySelector("#button-equal").onclick = () => equalPressedEventHandler();

    document.querySelector("#button-clear").onclick = () => {
        changeInput(0, stringModeEnum.WRITE);
        stack = [];
        updateExpression();
        hasInputStarted = true;
    }

    document.querySelector("#button-clear-input").onclick = () => {
        changeInput(0, stringModeEnum.WRITE);
        hasInputStarted = true;
    }

    document.querySelector("#button-backspace").onclick = () => {
        backspacePressedEventHandler();
    }

    document.querySelector("#button-plusminus").onclick = () => {
        let num = Number(inputDisplay.innerHTML);
        if (typeof num == "number") {
            changeInput(-num, stringModeEnum.WRITE);
        }
    }

    document.querySelector("#button-point").onclick = (element) => {
        if (!hasInputStarted && inputDisplay.innerHTML.indexOf(".") == -1) {
            changeInput(element.currentTarget.innerHTML, stringModeEnum.APPEND);
        }
    }

    document.onkeydown = (e) => {
        keypressHandler(e.key);
    }

}

