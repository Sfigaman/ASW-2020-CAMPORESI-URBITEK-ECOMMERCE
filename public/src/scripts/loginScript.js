var socket = io();
var modal = document.getElementById('id01');

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

var app = new Vue({
    el: "#logins-app",
    data: {
        Name: '',
        Company: '',
        Mail: '',
        Phone: ''
    },
    methods: {
        loginToApp: function () {
            var username = document.getElementById("username").value;
            var newPassword = CryptoJS.MD5(document.getElementById("password").value);
            var password = newPassword.toString();
            axios.post('/login', {
              username: username,
              password: password
            }).then(response => {
                if (response.status == '200') {
                    window.open("/home", "_top");
                } else if (response.status == '201') {
                    window.open("/homeAdmins", "_top");
                } else {
                    alert(response.data);
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        requestAccount: function() {
            if (this.Name !== '' && this.Company !== '') {
                if (validateEmail(this.Mail) || /^\d+$/.test(this.Phone)) {
                    axios.post('/requestAccount', {mail: this.Mail, phone: this.Phone, name: this.Name, company: this.Company}).then(response => {
                            var stringArray = JSON.stringify(response).split("\"");
                            alert(stringArray[5]);
                        this.Name = '';
                        this.Company = '';
                        this.Mail = '';
                        this.Phone = '';
                        }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        alert('Inserire ALMENO UNO tra MAIL e TELEFONO');
                    }
                } else {
                    alert("Inserire un RECAPITO VALIDO e l'AZIENDA");
                }
        },
    }
});

function guest() {
    var number = Math.floor(Math.random() * 100) + 1;
    window.open("/loginGuest?number=" + number, "_top");
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
