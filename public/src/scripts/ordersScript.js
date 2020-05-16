var app = new Vue({
    el: "#orders-app",
    data: function() {
        return {
            orders: []
        }
    },
    methods: {
        listProducts: function () {
            axios.post('/findOrdersQuery').then(response => {
              this.orders = response.data;
            }).catch(function (error) {
              console.log(error);
            });
        },
        getTotal: function (order) {
                var tot = 0;
                order.products.forEach(function(element) {
                    tot = tot + ((element.price * element.quantity)-((element.price * element.quantity)*(element.discount + order.discount)) / 100 );
                });
                return tot;
        },
        init: function(){
            this.listProducts();
        }
    },
    mounted() {
        this.init();
    }
});

