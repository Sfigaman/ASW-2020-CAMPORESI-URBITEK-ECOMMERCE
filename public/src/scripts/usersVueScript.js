var app = new Vue({
    el: "#users-app",
    data: {
        name: '',
        surname: '',
        company: '',
        mail: '',
        phone: '',
        password: '',
        confirmation: ''
    },
    methods: {
        modifyFields: function () {
            axios.post('/modifyByUserQuery', {
            name: this.name,
            surname: this.surname,
            company: this.company,
            mail: this.mail,
            phone: this.phone
            }).then(response => {
                var stringArray = JSON.stringify(response).split("\"");
                alert(stringArray[5]);
                this.name = '';
                this.surname = '';
                this.company = '';
                this.mail = '';
                this.phone = '';
            }).catch(function (error) {
              console.log(error);
            });
        },
        modifyPassword: function () {
            axios.post('/modifyByUserQuery', {
            password: this.password,
            confirmation: this.confirmation
            }).then(response => {
              var stringArray = JSON.stringify(response).split("\"");
              alert(stringArray[5]);
                this.password = '';
                this.confirmation = '';
            }).catch(function (error) {
              console.log(error);
            });
        },
    }
});
