var users = [];

/**
 * Class SuperUser
 * @constructor
 */
// Add method to prototype String
String.prototype.firstLetterCaps = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function SuperUser() {
    this.isDataVisibile = true;
}

// Add method to prototype SuperUser
SuperUser.prototype.changeDataVisibility = function () {
    this.isDataVisibile = !(this.isDataVisibile);
};

/**
 * Class User
 * @constructor
 */
function User() {
    SuperUser.call(this);

    this.yourName = '';
    this.yourAddress = '';
    this.yourEmail = '';
    this.yourPhone = '';
    this.yourBirth = '';
    this.yourSex = '';


    /**
     * Function Check on User Exists
     * @param yourEmail
     * @returns {boolean}
     */
    this.duplicateEmail = function (yourEmail) {
        var exists = false;
        if (users.length) {
            for (var key in users) {
                if (users[key].yourEmail === yourEmail) exists = true;
            }
        }
        return exists;
    };

    /**
     * Validation function
     * @param fieldsArray
     * @returns {Array}
     */
    this.isValid = function (fieldsArray) {

        var validationArray = [];

        if (fieldsArray) {
            for (var k in fieldsArray) {
                var nameField = k;
                var inputValue = fieldsArray[k].value.trim();
                var valid = false;
                var errorMessage = '';

                if (inputValue) {

                    //check field Name
                    if (nameField === 'name') {

                        var regexpName = new RegExp('^[a-zA-Z0-9_-]{3,16}$');
                        valid = regexpName.test(inputValue);
                        if (!valid) {
                            errorMessage = "Incorrect data in field \"Name\"";
                        }
                    }
                    //check field Email
                    else if (nameField === 'email') {
                        var regexpEmail = new RegExp('^.+@.+$');
                        valid = regexpEmail.test(inputValue);
                        if (!valid) {
                            errorMessage = "Incorrect data in field \"Email\"";
                        }
                    }
                    //check field Phone
                        else if(nameField === 'phone'){
                        var regexpPhone = new RegExp('^[\+][3]{1}[8]{1}\ [0-9]{3}\ [0-9]{3}[0-9]{2}[0-9]{2}$');
                        valid = regexpPhone.test(inputValue);
                        if (!valid) {
                            errorMessage = "Incorrect data in field \"Phone\". Format +38 888 8888888";
                        }
                    }
                    //check field Birth
                    else if(nameField === 'birth'){
                        valid = new Date(inputValue) < new Date(Date.now());
                        if (!valid) {
                            errorMessage = "Date should not be in future";
                        }
                    }

                    else {
                        valid = !!(inputValue);
                    }
                } else {
                    errorMessage = "Field " + nameField + " should not be empty !";
                }

                var result = {
                    name: nameField,
                    value: inputValue,
                    valid: valid,
                    message: errorMessage
                };
                validationArray.push(result);
            }
        } else {
            alert('Error'); // Заменить
    }

        return validationArray;
    };
}

User.prototype = new SuperUser();

/**
 * View function-constructor
 * @constructor
 */
function View() {

    var self = this;
    var table = document.querySelector('table tbody');
    var form = document.getElementById('main-form');

    // input fields object
    var inputField = {
        'name': document.getElementById('name'),
        'address': document.getElementById('address'),
        'email': document.getElementById('email'),
        'phone': document.getElementById('phone'),
        'birth': document.getElementById('birth'),
        'sex': document.getElementById('sex')
    };

    /*********/
    this.bindEvents = function () {
        form.onsubmit = this.onSaveButtonClick;
    };


    /*********/
    this.clearForm = function () {
        inputField.name.value = '';
        inputField.address.value = '';
        inputField.email.value = '';
        inputField.phone.value = '';
        inputField.birth.value = '';
        inputField.sex.value = 'Male';
        this.clearErrors();
    };
    /*********/
    this.clearErrors = function () {
        for (var key in inputField) {
            var id = inputField[key].id;

            inputField[id].classList.remove('has-error');
            inputField[id].classList.remove('has-success');

            if (inputField[id].parentNode.parentNode.querySelector('.invalid-feedback')) {
                inputField[id].parentNode.parentNode.querySelector('.invalid-feedback').innerText = '';
            }
        }
    };
    /*********/
    this.render = function () {
        this.clearTable();

        users.forEach(function (user) {
            self.addRow(user);
        });
    };
    /*********/

    this.clearTable = function () {
        table.innerHTML = '';
    };


    /**
     * Create new user on on click save
     * @param e
     */
    this.onSaveButtonClick = function (e) {
        e.preventDefault();

        self.clearErrors();

        // Create object user to constructor User()
        var user = new User();

        var checkOnValid = user.isValid(inputField);
        var isInValid = 0;

        if (checkOnValid) {
            for (var key in checkOnValid) {
                var name = checkOnValid[key].name;
                inputField[name].classList.remove('has-error');
                inputField[name].classList.remove('has-success');

                if (!checkOnValid[key].valid) {
                    var displayError = inputField[name].parentNode.parentNode.querySelector('.invalid-feedback');
                    displayError.style.display = "block";
                    displayError.innerText = checkOnValid[key].message;
                    inputField[name].classList.add('has-error');
                    isInValid++;

                } else {
                    inputField[name].classList.add('has-success');
                }

            }


            if (isInValid === 0) {
                if (user.duplicateEmail(inputField.email.value)) {
                    alert('User with such email is already exists!');
                } else {
                    user.yourName = inputField.name.value;
                    user.yourAddress = inputField.address.value;
                    user.yourEmail = inputField.email.value;
                    user.yourPhone = inputField.phone.value;
                    user.yourBirth = inputField.birth.value;
                    user.yourSex = inputField.sex.value;

                    users.push(user);
                    self.clearForm();
                    self.render();
                }

            }
        }
    };

    /**
     * Function addRow - added rows to the table
     * @param user
     */
    this.addRow = function (user) {
        var tr = document.createElement('tr');
        tr.addEventListener('click', self.onRowClick);

        var tdName = document.createElement('td');
        tdName.innerHTML = user.yourName.firstLetterCaps();
        tdName.setAttribute('data', 'show-hide');
        tr.appendChild(tdName);

        var tdSex = document.createElement('td');
        tdSex.innerHTML = user.yourSex;
        tr.appendChild(tdSex);

        var tdBirth = document.createElement('td');
        tdBirth.innerHTML = user.yourBirth;
        tr.appendChild(tdBirth);

        var tdPhone = document.createElement('td');
        tdPhone.innerHTML = user.yourPhone;
        tr.appendChild(tdPhone);

        var tdEmail = document.createElement('td');
        tdEmail.innerHTML = user.yourEmail.firstLetterCaps();
        tr.appendChild(tdEmail);

        var tdAddress = document.createElement('td');
        tdAddress.innerHTML = user.yourAddress.firstLetterCaps();
        tr.appendChild(tdAddress);

        table.appendChild(tr);
    };


    /**
     * Function onRowClick - show-hide row
     * @param e
     */
    this.onRowClick = function (e) {

        var currentRow = e.target.parentNode;
        var showHide = currentRow.getAttribute('show-hide');

        var user = users.find(function (user) {
            return user.name == showHide;
        });

        if (user) {
            user.changeDataVisibility();
            if (user.isDataVisibile) {
                currentRow.classList.remove('hidden-row');
            } else {
                currentRow.classList.add('hidden-row');
            }

        }

    }
}

var table = new View();
table.bindEvents();













