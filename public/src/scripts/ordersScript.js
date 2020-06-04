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
                    tot = tot + (((element.price - ((element.price * element.discount) / 100)) - (((element.price - (((element.price * element.discount) / 100))) * order.discount) / 100)) * element.quantity);
                });
                return tot;
        },
        init: function(){
            this.listProducts();
        }
    },
	filters: {
		round: function (value) {
			return Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);
		}
	},
    mounted() {
        this.init();
    }
});

