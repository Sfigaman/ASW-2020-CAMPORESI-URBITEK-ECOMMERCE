var app = new Vue({
    el: "#favorites-app",
    data: function() {
        return {
            favorites: [],
            total: 0,
            userDiscount: 0,
            empty: true,
        }
    },
    methods: {
        addToCart: function(element) {
            var number = element.quantity * 1;
            var productCode = element.productId;
            var productName = element.productName;
            var productPrice = element.price * 1;
            var productDiscount = element.discount * 1;
            axios.post('/cartsQuery', {
                mode: 'insert',
                productId: productCode,
                productName: productName,
                quantity: number,
                price: productPrice,
                discount: productDiscount
            }).then(response => {}).catch(function (error) {
                console.log(error);
            });
            alert("Prodotto " + element.productId + " Aggiunto al Carrello con Quantità " + number);
        },
        listProducts: function () {
            axios.post('/findUserQuery').then(response => {
                this.favorites = response.data.favorites;
                var tot = 0;
                if (response.data.discount !== undefined) {
                    this.userDiscount = response.data.discount;
                    response.data.favorites.forEach(function(element) {
                        tot = tot + ((element.price * element.quantity)-((element.price * element.quantity)*(element.discount + response.data.discount)) / 100 );
                    });
                    } else {
                        response.data.favorites.forEach(function(element) {
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
        removeFromFavorites: function(element) {
            var productCode = element.productId;
            var productName = element.productName;
            var number = element.quantity * 1;
            var productPrice = element.price * 1;
            var productDiscount = element.discount * 1;
            if (number !== null && number !== "" && number !== 0) {
                axios.post('/favoritesQuery', {
                    mode: 'delete',
                    productId: productCode,
                    productName: productName,
                    quantity: number,
                    price: productPrice,
                    discount: productDiscount
                }).then(response => {
                    alert("Prodotto " + element.productId + " Rimosso dai Preferiti");
                    this.listProducts();
                }).catch(function (error) {
                    console.log(error);
                });
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
