let display = document.getElementById("display");
let expression = "";

// Optional: Button click sound (put click.mp3 in project folder)
let clickSound = new Audio('click.mp3');

// Number input
function appendNumber(num) {
    clickSound.play();
    expression += num;
    display.value = expression;
}

// Operator input
function setOperator(op) {
    clickSound.play();
    if (expression === "") return;

    let lastChar = expression[expression.length - 1];

    if ("+-*/".includes(lastChar)) return; // Prevent double operators

    expression += op;
    display.value = expression;
}

// Clear
function clearDisplay() {
    clickSound.play();
    expression = "";
    display.value = "";
}

// Delete
function deleteLast() {
    clickSound.play();
    expression = expression.slice(0, -1);
    display.value = expression;
}

// Main Calculate Function (Multi-operation with precedence)
function calculate() {
    clickSound.play();
    if (expression === "") return;

    let numbers = [];
    let operators = [];
    let currentNumber = "";

    // Split numbers & operators
    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        if ("+-*/".includes(char)) {
            numbers.push(parseFloat(currentNumber));
            operators.push(char);
            currentNumber = "";
        } else {
            currentNumber += char;
        }
    }
    numbers.push(parseFloat(currentNumber));

    // Solve * and /
    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === "*" || operators[i] === "/") {
            let result;
            if (operators[i] === "*") {
                result = numbers[i] * numbers[i + 1];
            } else {
                if (numbers[i + 1] === 0) {
                    display.value = "Error";
                    expression = "";
                    return;
                }
                result = numbers[i] / numbers[i + 1];
            }
            numbers.splice(i, 2, result);
            operators.splice(i, 1);
            i--; // Adjust index
        }
    }

    // Solve + and -
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === "+") {
            result += numbers[i + 1];
        } else {
            result -= numbers[i + 1];
        }
    }

    display.value = result;
    expression = result.toString();
}

// Keyboard support
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (!isNaN(key) || "+-*/.".includes(key)) {
        appendNumber(key);
    } else if (key === "Enter") {
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearDisplay();
    }
});