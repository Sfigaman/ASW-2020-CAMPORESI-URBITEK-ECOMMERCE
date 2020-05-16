function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

var app = new Vue({
    el: "#guest-app",
    data: {
        Name: '',
        Company: '',
        Mail: '',
        Phone: ''
    },
    methods: {
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
