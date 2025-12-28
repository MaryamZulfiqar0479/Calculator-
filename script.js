let display = document.getElementById("display");
let historyList = document.getElementById("historyList");

// 1. Numbers aur Operators display par add karne ke liye
function appendNumber(num) {
    if (display.value === "0" || display.value === "Error") {
        display.value = num;
    } else {
        display.value += num;
    }
}

function appendOperator(op) {
    // Agar screen khali hai aur minus nahi hai toh return karein
    if (display.value === "" && op !== "-") return;
    display.value += op;
}

// 2. Scientific functions ko display par likhna
function sin() { display.value += "sin("; }
function cos() { display.value += "cos("; }
function tan() { display.value += "tan("; }
function sqrt() { display.value += "sqrt("; }

// 3. Calculation Logic (The Real Fix)
function calculate() {
    try {
        let input = display.value;
        if (input === "") return;

        // Display waali "sin(45)" ko "Math.sin(45 * PI/180)" mein convert karna
        let formula = input
            .replace(/sin\(/g, "Math.sin(")
            .replace(/cos\(/g, "Math.cos(")
            .replace(/tan\(/g, "Math.tan(")
            .replace(/sqrt\(/g, "Math.sqrt(");

        // Degree ko Radian mein convert karne ka logic (Trigonometry ke liye)
        // Ye har number jo sin/cos/tan ke andar hai usay degree maan kar solve karega
        formula = formula.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g, (match, func, val) => {
            return `Math.${func}((${val}) * Math.PI / 180)`;
        });

        // Agar user ne bracket ")" band nahi kiya toh khud band kar dena
        let openBrackets = (formula.match(/\(/g) || []).length;
        let closeBrackets = (formula.match(/\)/g) || []).length;
        while (openBrackets > closeBrackets) {
            formula += ")";
            input += ")";
            closeBrackets++;
        }

        // Result calculate karna
        let result = eval(formula);

        // Result agar lamba decimal hai toh 4 digits tak limit karna
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(4));
        }

        addHistory(`${input} = ${result}`);
        display.value = result;

    } catch (e) {
        display.value = "Error";
    }
}

// 4. Basic Controls
function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function square() {
    try {
        let val = eval(display.value);
        let res = Math.pow(val, 2);
        addHistory(`${val}² = ${res}`);
        display.value = res;
    } catch (e) { display.value = "Error"; }
}

function percentage() {
    try {
        display.value = (eval(display.value) / 100).toString();
    } catch (e) { display.value = "Error"; }
}

// History update
function addHistory(text) {
    let li = document.createElement("li");
    li.textContent = text;
    historyList.prepend(li);
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}