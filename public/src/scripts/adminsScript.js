var app = new Vue({
    el: "#admins-app",
data: {
    productCodeCreate: '',
    productNameCreate: '',
    productDescriptionCreate: '',
    productPriceCreate: '',
    productDiscountCreate: '',
    productTypeCreate: '',
    productCodeModify: '',
    productNameModify: '',
    productDescriptionModify: '',
    productPriceModify: '',
    productDiscountModify: '',
    productCodeDelete: '',
    userPasswordCreate: '',
    userNameCreate: '',
    userSurnameCreate: '',
    userCompanyCreate: '',
    userMailCreate: '',
    userPhoneCreate: '',
    userDiscountCreate: '',
    userRoleCreate: '',
    userUsernameCreate: '',
    userUsernameDelete: '',
    userPasswordModify: '',
    userNameModify: '',
    userSurnameModify: '',
    userCompanyModify: '',
    userMailModify: '',
    userPhoneModify: '',
    userDiscountModify: '',
    userUsernameModify: ''
},
    methods: {
        createProduct: function () {
            axios.post('/createProductQuery', {
            code: this.productCodeCreate,
            name: this.productNameCreate,
            description: this.productDescriptionCreate,
            price: this.productPriceCreate,
            discount: this.productDiscountCreate,
            type: this.productTypeCreate
            }).then(response => {
                var stringArray = JSON.stringify(response).split("\"");
                alert(stringArray[5]);
                socket.emit('message', 'Un Nuovo Prodotto è stato Creato!');
                this.productCodeCreate = '';
                this.productNameCreate = '';
                this.productDescriptionCreate = '';
                this.productPriceCreate = '';
                this.productDiscountCreate = '';
                this.productTypeCreate = '';
            }).catch(function (error) {
              console.log(error);
            });
        },
        modifyProduct: function () {
            axios.post('/modifyProductQuery', {
            code: this.productCodeModify,
            name: this.productNameModify,
            description: this.productDescriptionModify,
            price: this.productPriceModify,
            discount: this.productDiscountModify
            }).then(response => {
              var stringArray = JSON.stringify(response).split("\"");
              alert(stringArray[5]);
                this.productCodeModify = '';
                this.productNameModify = '';
                this.productDescriptionModify = '';
                this.productPriceModify = '';
                this.productDiscountModify = '';
                if (stringArray[5] == 'Product Successfully Updated') {
                    socket.emit('message', 'Un Prodotto è stato Modificato!');
                }
            }).catch(function (error) {
              console.log(error);
            });
        },
        deleteProduct: function () {
            axios.post('/deleteProductQuery', {
            code: this.productCodeDelete
            }).then(response => {
              var stringArray = JSON.stringify(response).split("\"");
              alert(stringArray[5]);
                if (stringArray[5] == 'Product Successfully Deleted') {
                    socket.emit('message', 'Un Prodotto è stato Eliminato!');
                }
                this.productCodeDelete = '';
            }).catch(function (error) {
              console.log(error);
            });
        },
        createUser: function () {
            axios.post('/createUserQuery', {
            username: this.userUsernameCreate,
            password: this.userPasswordCreate,
            name: this.userNameCreate,
            surname: this.userSurnameCreate,
            company: this.userCompanyCreate,
            mail: this.userMailCreate,
            phone: this.userPhoneCreate,
            discount: this.userDiscountCreate,
            role: this.userRoleCreate
            }).then(response => {
                var stringArray = JSON.stringify(response).split("\"");
                alert(stringArray[5]);
                this.userPasswordCreate = '';
                this.userNameCreate = '';
                this.userSurnameCreate = '';
                this.userCompanyCreate = '';
                this.userMailCreate = '';
                this.userPhoneCreate = '';
                this.userDiscountCreate = '';
                this.userRoleCreate = '';
                this.userUsernameCreate = '';
            }).catch(function (error) {
              console.log(error);
            });
        },
        modifyUser: function () {
            axios.post('/modifyUserQuery', {
            username: this.userUsernameModify,
            password: this.userPasswordModify,
            name: this.userNameModify,
            surname: this.userSurnameModify,
            company: this.userCompanyModify,
            mail: this.userMailModify,
            phone: this.userPhoneModify,
            discount: this.userDiscountModify
            }).then(response => {
              var stringArray = JSON.stringify(response).split("\"");
              alert(stringArray[5]);
                this.userPasswordModify = '';
                this.userNameModify = '';
                this.userSurnameModify = '';
                this.userCompanyModify = '';
                this.userMailModify = '';
                this.userPhoneModify = '';
                this.userDiscountModify = '';
                this.userUsernameModify = '';
            }).catch(function (error) {
              console.log(error);
            });
        },
        deleteUser: function () {
            axios.post('/deleteUserQuery', {
            username: this.userUsernameDelete
            }).then(response => {
              var stringArray = JSON.stringify(response).split("\"");
              alert(stringArray[5]);
                this.userUsernameDelete = '';
            }).catch(function (error) {
              console.log(error);
            });
        },
    }
});
