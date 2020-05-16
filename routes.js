var bodyParser = require('body-parser');
var express = require('express');
var Controller = require("/Users/Sfigaman/NODEJS/project/public/src/controllers/controller.js");
var User = require("/Users/Sfigaman/NODEJS/project/public/src/models/user.js").user();
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
var result = '';
var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var charactersLength = characters.length;
var length = 8;

exports.setup = function(app) {
    // Inizializzazione Body Parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    // Inizializzazione Sessione Cookie
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    app.use(cookieSession({
        name: 'session',
        secret: result,
        maxAge: 24 * 60 * 60 * 1000
    }));
    
    // Richiesta per la Home
    app.get('/', function(req, res) {
        req.session = null;
        res.sendFile(__dirname + '/private/login.html');
    });

    // Richiesta per la Home dopo Login
    app.post('/login', function(req, res) {
        User.findOne({
            $and: [
                   {username: req.body.username},
                   {password: req.body.password},
                   {role: 'admin'}
            ]}, function(err, user) {
                if (err) {
                    res.send(err);
                }
                if (!user) {
                    User.findOne({
                        $and: [
                        {username: req.body.username},
                        {password: req.body.password},
                        {role: 'user'}
                    ]}, function(err, user) {
                        if (err) {
                            res.send(err);
                        }
                        if (!user) {
                            res.setHeader('Content-Type', 'text/plain');
                            res.status(202).send('Ops... USERNAME O PASSWORD ERRATI');
                        } else {
                            if (req.session.isNew) {
                                req.session.username = user.username;
                                req.session.lastPage = 'home';
                                res.setHeader('Content-Type', 'text/plain');
                                res.status(200).send('LOGIN OK');
                            } else {
                                res.setHeader('Content-Type', 'text/plain');
                                res.status(202).send('Ops... SESSIONE TERMINATA');
                            }
                        }
                    });
                } else {
                    if (req.session.isNew) {
                        req.session.username = user.username;
                        req.session.lastPage = 'home';
                        res.setHeader('Content-Type', 'text/plain');
                        res.status(201).send('LOGIN OK');
                    } else {
                        res.setHeader('Content-Type', 'text/plain');
                        res.status(202).send('Ops... SESSIONE TERMINATA');
                    }
                }
        });
    });

    app.get('/loginGuest', function(req, res) {
        var username = 'GUEST' + req.query.number;
        User.findOne({
            $and: [
            {username: username},
            {role: 'guest'}
        ]}, function(err, user) {
            if (err) {
                res.send(err);
            }
            if (!user) {
                var new_user = new User();
                new_user.username = username;
                new_user.role = 'guest';
                new_user.save(function(err, user) {
                    if (err) { res.send(err); }
                });
                req.session.username = username;
                req.session.lastPage = 'home';
                res.sendFile(__dirname + '/private/guests/homeGuests.html');
            } else {
                if (req.session.isNew) {
                    User.updateOne({
                        username: username
                    }, { cart: []}, function(err, user) {
                        if (err) { res.send(err); }
                    });
                    req.session.username = username;
                    req.session.lastPage = 'home';
                    res.sendFile(__dirname + '/private/guests/homeGuests.html');
                } else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.status(404).send('Ops... SESSIONE TERMINATA');
                }
            }
        });
    });
    
    app.get('/home', function(req, res) {
        if (!req.session.isNew) {
            req.session.lastPage = 'home';
            res.sendFile(__dirname + '/private/users/home.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    })
    
    // Richiesta per la Home dopo Accesso Guest
    app.get('/homeGuests', function(req, res) {
        if (!req.session.isNew) {
            req.session.lastPage = 'home';
            res.sendFile(__dirname + '/private/guests/homeGuests.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });

    app.get('/homeAdmins', function(req, res) {
        if (!req.session.isNew) {
            req.session.lastPage = 'home';
            res.sendFile(__dirname + '/private/admins/homeAdmins.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });

    // Richiesta per l'Account dopo Login
    app.get('/account', function(req, res) {
        if (!req.session.isNew){
            req.session.lastPage = 'account';
            res.sendFile(__dirname + '/private/users/account.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });

    app.get('/accountAdmins', function(req, res) {
        if (!req.session.isNew){
            req.session.lastPage = 'account';
            res.sendFile(__dirname + '/private/admins/accountAdmins.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });

    // Richiesta per Ordini dopo Login
    app.get('/orders', function(req, res) {
        if (!req.session.isNew){
            req.session.lastPage = 'orders';
            res.sendFile(__dirname + '/private/users/orders.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });

    app.get('/products', function(req, res) {
        if (!req.session.isNew){
            req.session.lastPage = 'products';
            res.sendFile(__dirname + '/private/admins/products.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });

    // Richiesta per il Carrello dopo Login
    app.get('/cart', function(req, res) {
        if (!req.session.isNew){
            req.session.lastPage = 'cart';
            res.sendFile(__dirname + '/private/users/cart.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });

    // Richiesta per il Carrello dopo Accesso Guest
    app.get('/cartGuests', function(req, res) {
        if (!req.session.isNew) {
            req.session.lastPage = 'cart';
            res.sendFile(__dirname + '/private/guests/cartGuests.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });
    
    app.get('/ricercaUsers', function(req, res) {
        if (!req.session.isNew){
            req.session.lastPage = 'ricerca';
            res.sendFile(__dirname + '/private/users/ricercaUsers.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });
    
    app.get('/ricercaGuests', function(req, res) {
        if (!req.session.isNew){
            req.session.lastPage = 'ricerca';
            res.sendFile(__dirname + '/private/guests/ricercaGuests.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });
    
    app.get('/ricercaAdmins', function(req, res) {
        if (!req.session.isNew){
            req.session.lastPage = 'ricerca';
            res.sendFile(__dirname + '/private/admins/ricercaAdmins.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });
    
    app.get('/ricercaAccount', function(req, res) {
        if (!req.session.isNew){
            req.session.lastPage = 'ricercaAccount';
            res.sendFile(__dirname + '/private/admins/ricercaAccount.html');
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Ops... SESSIONE TERMINATA');
        }
    });

    // INIZIO ROUTE DB
    
    app.route('/ricerca').post(Controller.view_products);
    app.route('/cartsQuery').post(Controller.modify_cart);
    app.route('/ordersQuery').post(Controller.create_order);
    app.route('/createProductQuery').post(Controller.create_product);
    app.route('/deleteProductQuery').post(Controller.delete_product);
    app.route('/modifyProductQuery').post(Controller.modify_product);
    app.route('/usersQuery').post(Controller.view_users);
    app.route('/createUserQuery').post(Controller.create_user);
    app.route('/modifyUserQuery').post(Controller.modify_user);
    app.route('/modifyByUserQuery').post(Controller.modify_byUser);
    app.route('/deleteUserQuery').post(Controller.delete_user);
    app.route('/findCartQuery').post(Controller.find_cart);
    app.route('/findOrdersQuery').post(Controller.find_orders);
    app.route('/findUserQuery').post(Controller.find_user);
    app.route('/requestAccount').post(Controller.request_account);
    
    // FINE ROUTE DB

    app.use(express.static('public'));
    app.use(function (req, res, next) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Ops... Pagina Non Trovata');
    });
}
