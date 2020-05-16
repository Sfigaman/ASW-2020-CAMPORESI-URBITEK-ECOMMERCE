var app = new Vue({
    el: "#home-app",
    data: function() {
        return {
            user: []
        }
    },
    methods: {
        findUser: function () {
            axios.post('/findUserQuery').then(response => {
              this.user = response.data;
            }).catch(function (error) {
              console.log(error);
            });
        },
        init: function(){
            this.findUser();
        }
    },
    mounted() {
        this.init();
    }
});
