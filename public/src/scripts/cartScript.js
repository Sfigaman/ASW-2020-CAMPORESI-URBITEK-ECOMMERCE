function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

var app = new Vue({
    el: "#cart-app",
    data: function() {
        return {
            cart: [],
            total: 0,
            userDiscount: 0,
            empty: true,
            Name: '',
            Company: '',
            Mail: '',
            Phone: ''
        }
    },
    methods: {
        listProducts: function () {
            axios.post('/findUserQuery').then(response => {
                this.cart = response.data.cart;
                var tot = 0;
                if (response.data.discount !== undefined) {
                    this.userDiscount = response.data.discount;
                    response.data.cart.forEach(function(element) {
                        tot = tot + ((element.price * element.quantity)-((element.price * element.quantity)*(element.discount + response.data.discount)) / 100 );
                    });
                    } else {
                        response.data.cart.forEach(function(element) {
                            tot = tot + ((element.price * element.quantity)-((element.price * element.quantity)*element.discount) / 100 );
                        });
                    }
                    if (tot > 0) {
                        this.empty = false;
                    } else {
                        this.empty = true;
                    }
                this.total = tot;
            }).catch(function (error) {
              console.log(error);
            });
        },
        removeFromCart: function(element) {
            var productCode = element.productId;
            var productName = element.productName;
            var number = element.quantity * 1;
            var productPrice = element.price * 1;
            var productDiscount = element.discount * 1;
            if (number !== null && number !== "" && number !== 0) {
                axios.post('/cartsQuery', {
                    mode: 'delete',
                    productId: productCode,
                    productName: productName,
                    quantity: number,
                    price: productPrice,
                    discount: productDiscount
                }).then(response => {
                    alert("Prodotto " + element.productId + " Rimosso dal Carrello");
                    this.listProducts();
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },
        confirmOrder: function() {
                axios.post('/ordersQuery', {}).then(response => {
                    var stringArray = JSON.stringify(response).split("\"");
                    alert(stringArray[5]);
                    this.listProducts();
                }).catch(function (error) {
                    console.log(error);
                });
        },
        confirmOrderGuest: function() {
                if (this.Name !== '') {
                    if (validateEmail(this.Mail) || /^\d+$/.test(this.Phone)) {
                        axios.post('/ordersQuery', {mail: this.Mail, phone: this.Phone, name: this.Name, company: this.Company}).then(response => {
                            var stringArray = JSON.stringify(response).split("\"");
                            alert(stringArray[5]);
                            this.listProducts();
                            this.Name = '';
                            this.Company = '';
                            this.Phone = '';
                            this.Mail = '';
                        }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        alert('Inserire ALMENO UNO tra MAIL e TELEFONO');
                    }
                } else {
                    alert('Inserire un RECAPITO VALIDO');
                }
        },
        init: function(){
            this.listProducts();
        }
    },
    mounted() {
        this.init();
    }
});
