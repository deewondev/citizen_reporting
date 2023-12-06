const userValidation = () => {
    const userInput = document.getElementById('regUsernameInput');
    const userValue = document.getElementById('regUsernameInput').value;
    const passwordInput = document.getElementById('regPasswordInput');
    const passwordValue = document.getElementById('regPasswordInput').value;
    let minLength = 8;
    let maxLength = 25;
    let hasUppercase = /[A-Z]/.test(passwordValue);
    let hasLowercase = /[a-z]/.test(passwordValue);
    let hasNumber = /\d/.test(passwordValue);
    let hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(passwordValue);
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,25}$/;

    if (userValue.length >= 4 && userValue.length <= 16) {
        // clear the custom validation message
        userInput.setCustomValidity('');
    } else {
        // set the custom validation message
        if (userValue !== '')
            userInput.setCustomValidity('Username should be between 4 and 16 characters.');
    }

    // if (passwordRegex.test(passwordValue)) {
    if (passwordValue.length > minLength && passwordValue.length < maxLength && hasUppercase 
        && hasLowercase && hasNumber && hasSpecialChar) {
        // clear the custom validation message
        passwordInput.setCustomValidity('');
    } else {
        // set the custom validation message
        if (passwordValue !== '')
            passwordInput.setCustomValidity('Password must have atleast one uppercase and lowercase letters, one number, one special character, minimum of 8 characters, and maximum of 25 characters');
    }
}
