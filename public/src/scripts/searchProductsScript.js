var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var searchParam = urlParams.get('search');
var searchTypeParam = urlParams.get('searchType');

var app = new Vue({
    el: "#products-app",
    data: function() {
        return {
            products: [],
            productsNoDiscount: [],
            productsDiscounted: [],
            discounted: 0
        }
    },
    methods: {
        listProducts: function () {
            axios.post('/ricerca', {
              searchType: searchTypeParam,
              search: searchParam
            }).then(response => {
              this.products = response.data;
                var withDiscount = [];
                var withoutDiscount = [];
                var number = 0;
                response.data.forEach(function (item) {
                    if (item.discount > 0) {
                        withDiscount.push(item);
                        number ++;
                    } else {
                        withoutDiscount.push(item);
                    }
                });
                this.productsDiscounted = withDiscount;
                this.productsNoDiscount = withoutDiscount;
                this.discounted = number;
            }).catch(function (error) {
              console.log(error);
            });
        },
        addToCart: function(product) {
            var number;
            var productCode = product.code;
            var productName = product.name;
            var productPrice = product.price * 1;
            var productDiscount = product.discount * 1;
            var box = prompt("Quantità da Aggiungere:", "1");
            if (box !== null && box !== "" && box !== 0) {
                number = box * 1;
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
                alert("Prodotto " + product.code + " Aggiunto al Carrello con Quantità " + number);
            }
        },
        init: function(){
            this.listProducts();
        },
    },
    mounted() {
        this.init();
    }
});
