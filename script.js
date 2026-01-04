const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*'
};

const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercaseCheck');
const lowercaseCheck = document.getElementById('lowercaseCheck');
const numbersCheck = document.getElementById('numbersCheck');
const specialCheck = document.getElementById('specialCheck');
const strengthText = document.getElementById('strengthText');
const strengthProgress = document.getElementById('strengthProgress');
const notification = document.getElementById('notification');

lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
    if (passwordOutput.value) {
        updatePasswordStrength(passwordOutput.value);
    }
});

generateBtn.addEventListener('click', generatePassword);

copyBtn.addEventListener('click', copyToClipboard);

[uppercaseCheck, lowercaseCheck, numbersCheck, specialCheck].forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (passwordOutput.value) {
            updatePasswordStrength(passwordOutput.value);
        }
    });
});

window.addEventListener('load', generatePassword);

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const options = getSelectedOptions();
    
    if (options.availableChars.length === 0) {
        alert('Please select at least one character type!');
        return;
    }
    
    const password = createPassword(length, options);
    passwordOutput.value = password;
    updatePasswordStrength(password);
}

function getSelectedOptions() {
    let availableChars = '';
    const activeTypes = [];
    
    if (uppercaseCheck.checked) {
        availableChars += charSets.uppercase;
        activeTypes.push('uppercase');
    }
    if (lowercaseCheck.checked) {
        availableChars += charSets.lowercase;
        activeTypes.push('lowercase');
    }
    if (numbersCheck.checked) {
        availableChars += charSets.numbers;
        activeTypes.push('numbers');
    }
    if (specialCheck.checked) {
        availableChars += charSets.special;
        activeTypes.push('special');
    }
    
    return { availableChars, activeTypes };
}

function createPassword(length, options) {
    const { availableChars, activeTypes } = options;
    let password = '';
    
    activeTypes.forEach(type => {
        const charSet = charSets[type];
        password += charSet[getRandomIndex(charSet.length)];
    });
    
    for (let i = password.length; i < length; i++) {
        password += availableChars[getRandomIndex(availableChars.length)];
    }
    
    return shuffleString(password);
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = getRandomIndex(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function updatePasswordStrength(password) {
    const strength = evaluatePasswordStrength(password);
    
    strengthText.textContent = strength.label;
    
    strengthProgress.className = 'strength-progress ' + strength.class;
}

function evaluatePasswordStrength(password) {
    const length = password.length;
    const typesUsed = countCharacterTypes(password);
    
    if (length < 6 || typesUsed === 1) {
        return { label: 'Too Weak', class: 'too-weak' };
    }
    
    if (length >= 6 && length < 8 && typesUsed >= 2) {
        return { label: 'Weak', class: 'weak' };
    }
    
    if (length >= 8 && length < 12 && typesUsed >= 3) {
        return { label: 'Good', class: 'good' };
    }
    
    if (length >= 12 && typesUsed === 4) {
        return { label: 'Strong', class: 'strong' };
    }
    
    if (length >= 8 && typesUsed === 2) {
        return { label: 'Weak', class: 'weak' };
    }
    
    if (length >= 12 && typesUsed === 3) {
        return { label: 'Good', class: 'good' };
    }
    
    return { label: 'Weak', class: 'weak' };
}

function countCharacterTypes(password) {
    let count = 0;
    
    if (/[A-Z]/.test(password)) count++;
    if (/[a-z]/.test(password)) count++;
    if (/[0-9]/.test(password)) count++;
    if (/[!@#$%^&*]/.test(password)) count++;
    
    return count;
}

function copyToClipboard() {
    if (!passwordOutput.value) {
        alert('No password to copy!');
        return;
    }
    
    passwordOutput.select();
    passwordOutput.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(passwordOutput.value).then(() => {
        showNotification();
    }).catch(err => {
        document.execCommand('copy');
        showNotification();
    });
}

function showNotification() {
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}