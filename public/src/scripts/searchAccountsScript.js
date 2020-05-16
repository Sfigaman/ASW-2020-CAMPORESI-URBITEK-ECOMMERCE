var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var usernameParam = urlParams.get('username');
var roleParam = urlParams.get('role');
var app = new Vue({
    el: "#accounts-app",
    data: function() {
        return {
            accounts: []
        }
    },
    methods: {
        listAccounts: function () {
            axios.post('/usersQuery', {
              username: usernameParam,
              role: roleParam
            }).then(response => {
              this.accounts = response.data;
            }).catch(function (error) {
              console.log(error);
            });
        },
        init: function(){
            this.listAccounts();
        },
    },
    mounted() {
        this.init();
    }
});
