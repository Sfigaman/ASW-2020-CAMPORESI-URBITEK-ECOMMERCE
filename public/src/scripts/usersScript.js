var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get("username");
var number = url.searchParams.get("number");
var socket = io();

socket.on('message', function(msg){
    alert(msg.content);
    location.reload();
});

Vue.component('user-navbar', {
  template: `<div class="topnav" id="myTopnav">
      <a href="/home" class="active">Home</a>
      <a href="/account">Account</a>
      <a href="/orders">Ordini</a>
      <a href="/cart">Carrello</a>
      <a href="/">Esci</a>
      <div class="dropdown">
          <button class="dropbtn" id="dropButton">Tutti i Prodotti
              <i class="fa fa-caret-down"></i>
          </button>
          <div class="dropdown-content">
              <a href="#" onClick="allProducts()">Tutti i Prodotti</a>
              <a href="#" onClick="onStreet()">Parcometri</a>
              <a href="#" onClick="offStreet()">Parcheggi</a>
              <a href="#" onClick="repairs()">Riparazioni</a>
              <a href="#" onClick="consumables()">Consumabili</a>
          </div>
      </div>
      <div class="search-container">
          <form action="/ricercaUsers" method="get">
              <input id="inputType" type="hidden" name="searchType" value="all" />
              <input type="text" placeholder="Cerca..." name="search">
              <button type="submit"><i class="fa fa-search"></i></button>
          </form>
      </div>
      <a href="javascript:void(0);" style="font-size:15px;" class="icon" onclick="myFunction()">&#9776;</a>
  </div>`
});

Vue.component('guest-navbar', {
  template: `<div class="topnav" id="myTopnav">
      <a href="/homeGuests" class="active">Home</a>
      <a href="/cartGuests">Carrello</a>
      <a href="/">Esci</a>
      <div class="dropdown">
          <button class="dropbtn" id="dropButton">Tutti i Prodotti
              <i class="fa fa-caret-down"></i>
          </button>
          <div class="dropdown-content">
              <a href="#" onClick="allProducts()">Tutti i Prodotti</a>
              <a href="#" onClick="onStreet()">Parcometri</a>
              <a href="#" onClick="offStreet()">Parcheggi</a>
              <a href="#" onClick="repairs()">Riparazioni</a>
              <a href="#" onClick="consumables()">Consumabili</a>
          </div>
      </div>
      <div class="search-container">
          <form action="/ricercaGuests" method="get">
              <input id="inputType" type="hidden" name="searchType" value="all" />
              <input type="text" placeholder="Cerca..." name="search">
              <button type="submit"><i class="fa fa-search"></i></button>
          </form>
      </div>
      <a href="javascript:void(0);" style="font-size:15px;" class="icon" onclick="myFunction()">&#9776;</a>
  </div>`
});

Vue.component('admin-navbar', {
  template: `<div class="topnav" id="myTopnav">
      <a href="/homeAdmins" class="active">Home</a>
      <a href="/accountAdmins">Account</a>
      <a href="/products">Prodotti</a>
      <a href="/">Esci</a>
      <div class="dropdown">
          <button class="dropbtn" id="dropButton">Tutti i Prodotti
              <i class="fa fa-caret-down"></i>
          </button>
          <div class="dropdown-content">
              <a href="#" onClick="allProducts()">Tutti i Prodotti</a>
              <a href="#" onClick="onStreet()">Parcometri</a>
              <a href="#" onClick="offStreet()">Parcheggi</a>
              <a href="#" onClick="repairs()">Riparazioni</a>
              <a href="#" onClick="consumables()">Consumabili</a>
          </div>
      </div>
      <div class="search-container">
          <form action="/ricercaAdmins" method="get">
              <input id="inputType" type="hidden" name="searchType" value="all" />
              <input type="text" placeholder="Cerca..." name="search">
              <button type="submit"><i class="fa fa-search"></i></button>
          </form>
      </div>
      <a href="javascript:void(0);" style="font-size:15px;" class="icon" onclick="myFunction()">&#9776;</a>
  </div>`
});

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function onStreet() {
    var x = document.getElementById("dropButton");
    var y = document.getElementById("inputType");
    var text = '<i class="fa fa-caret-down"></i>';
    x.innerHTML = "Parcometri " + text;
    y.value = "parcometri";
}
function offStreet() {
    var x = document.getElementById("dropButton");
    var y = document.getElementById("inputType");
    var text = '<i class="fa fa-caret-down"></i>';
    x.innerHTML = "Parcheggi " + text;
    y.value = "parcheggi";
}
function allProducts() {
    var x = document.getElementById("dropButton");
    var y = document.getElementById("inputType");
    var text = '<i class="fa fa-caret-down"></i>';
    x.innerHTML = "Tutti i Prodotti " + text;
    y.value = "all";
}
function repairs() {
    var x = document.getElementById("dropButton");
    var y = document.getElementById("inputType");
    var text = '<i class="fa fa-caret-down"></i>';
    x.innerHTML = "Riparazioni " + text;
    y.value = "riparazioni";
}
function consumables() {
    var x = document.getElementById("dropButton");
    var y = document.getElementById("inputType");
    var text = '<i class="fa fa-caret-down"></i>';
    x.innerHTML = "Consumabili " + text;
    y.value = "consumabili";
}
