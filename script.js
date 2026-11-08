
const currentOperand = document.getElementById("current-operand");
const previousOperand = document.getElementById("previous-operand");

let currentInput = "0";
let previousInput = "";
let operator = null;
let resetScreen = false;

// Update calculator display
function updateDisplay() {
    currentOperand.textContent = currentInput;

    if (operator !== null && previousInput !== "") {
        previousOperand.textContent =
            `${previousInput} ${operator}`;
    } else {
        previousOperand.textContent = "";
    }
}

// Add numbers
function appendNumber(number) {
    if (currentInput === "Error") {
        currentInput = "0";
    }

    if (resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        if (currentInput === "0") {
            currentInput = number;
        } else if (currentInput.replace("-", "").length < 14) {
            currentInput += number;
        }
    }

    updateDisplay();
}

// Add decimal point
function addDecimal() {
    if (currentInput === "Error") {
        currentInput = "0";
    }

    if (resetScreen) {
        currentInput = "0";
        resetScreen = false;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

// Select mathematical operator
function chooseOperator(selectedOperator) {
    if (currentInput === "Error") return;

    if (operator !== null && !resetScreen) {
        calculate();
    }

    previousInput = currentInput;
    operator = selectedOperator;
    resetScreen = true;

    updateDisplay();
}

// Perform calculation
function calculate() {
    if (operator === null || resetScreen) return;

    const firstNumber = parseFloat(previousInput);
    const secondNumber = parseFloat(currentInput);

    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":
            if (secondNumber === 0) {
                currentInput = "Error";
                previousInput = "";
                operator = null;
                resetScreen = true;
                updateDisplay();
                return;
            }
            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    if (!Number.isFinite(result)) {
        currentInput = "Error";
    } else {
        result = Number(result.toPrecision(12));
        currentInput = String(result);
    }

    previousInput = "";
    operator = null;
    resetScreen = true;

    updateDisplay();
}

// Clear everything
function clearCalculator() {
    currentInput = "0";
    previousInput = "";
    operator = null;
    resetScreen = false;

    updateDisplay();
}

// Delete last digit
function deleteNumber() {
    if (currentInput === "Error" || resetScreen) {
        currentInput = "0";
        resetScreen = false;
    } else {
        currentInput = currentInput.slice(0, -1);

        if (currentInput === "" || currentInput === "-") {
            currentInput = "0";
        }
    }

    updateDisplay();
}

// Convert number into percentage
function percentage() {
    if (currentInput === "Error") return;

    currentInput = String(
        Number((parseFloat(currentInput) / 100).toPrecision(12))
    );

    resetScreen = true;
    updateDisplay();
}

// Change positive/negative sign
function changeSign() {
    if (currentInput === "Error" || currentInput === "0") return;

    currentInput = currentInput.startsWith("-")
        ? currentInput.slice(1)
        : "-" + currentInput;

    updateDisplay();
}

// Handle button clicks
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {

        if (button.dataset.number !== undefined) {
            appendNumber(button.dataset.number);
        }

        if (button.dataset.operator) {
            chooseOperator(button.dataset.operator);
        }

        const action = button.dataset.action;

        switch (action) {
            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteNumber();
                break;

            case "decimal":
                addDecimal();
                break;

            case "equals":
                calculate();
                break;

            case "percent":
                percentage();
                break;

            case "sign":
                changeSign();
                break;
        }
    });
});

// Keyboard support
document.addEventListener("keydown", event => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        appendNumber(key);
    } else if (key === ".") {
        addDecimal();
    } else if (key === "+") {
        chooseOperator("+");
    } else if (key === "-") {
        chooseOperator("-");
    } else if (key === "*") {
        chooseOperator("×");
    } else if (key === "/") {
        event.preventDefault();
        chooseOperator("÷");
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});

// Show initial display
updateDisplay();
