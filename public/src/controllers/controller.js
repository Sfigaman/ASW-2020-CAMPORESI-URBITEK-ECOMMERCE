var Product = require("./../models/product.js").product();
var User = require("./../models/user.js").user();
var mongoose = require('mongoose');
var CryptoJS = require("crypto-js");
var nodemailer = require('nodemailer');

// Visualizzazione Prodotti
exports.view_products = function(req, res) {
    if (req.body.search !== undefined && req.body.searchType !== 'all') {
        Product.find({
            $and: [
                   {$or: [{name: {$regex: req.body.search, $options: 'i'}}, {description: {$regex: req.body.search, $options: 'i'}}]},
                   {type: req.body.searchType}
            ]}, function(err, product) {
            if (err) { res.send(err); }
            res.json(product);
        });
    } else if (req.body.searchType !== 'all') {
        Product.find({type: req.body.searchType}, function(err, product) {
            if (err) { res.send(err); }
            res.json(product);
        });
    } else if (req.body.search !== undefined) {
        Product.find({$or: [{name: {$regex: req.body.search, $options: 'i'}}, {description: {$regex: req.body.search, $options: 'i'}}]}, function(err, product) {
            if (err) { res.send(err); }
            res.json(product);
        });
    } else {
        Product.find({}, function(err, product) {
            if (err) { res.send(err); }
            res.json(product);
        });
    }
}

// Creazione Prodotto
exports.create_product = function(req, res) {
    var new_product = new Product();
    var price = 0;
    var discount = 0;
    if (req.body.price !== undefined) {
        price = price + req.body.price * 1;
    }
    if (req.body.discount !== undefined) {
        discount = discount + req.body.discount * 1;
    }
    new_product.code = req.body.code;
    new_product.name = req.body.name;
    new_product.description = req.body.description;
    new_product.price = price;
    new_product.discount = discount;
    new_product.type = req.body.type;
    new_product.save(function(err, product) {
        if (err) { res.send(err); }
        res.json({ message: 'Product Successfully Created' });
    });
}

// Cancellazione Prodotto
exports.delete_product = function(req, res) {
    Product.deleteOne({code: req.body.code}, function (err, result) {
        if(result.deletedCount==0) {
            res.json({ message: 'Product NOT Found' });
        } else {
            res.json({ message: 'Product Successfully Deleted' });
            User.find({}, function(err, user) {
                if (err) { res.send(err); }
                user.forEach(function(user) {
                    if (user.role == 'user' || user.role == 'guest') {
                        user.cart.forEach(function(item) {
                            if (item.productId == req.body.code) {
                                var quantity = item.quantity * 1;
                                var price = item.price * 1;
                                var discount = item.discount * 1;
                                var name = item.productName;
                                User.updateOne({
                                username: user.username
                                }, { $pull: { cart: {
                                    productId: req.body.code,
                                    productName: name,
                                    price: price,
                                    discount: discount,
                                    quantity: quantity
                                }}}, function(err, user) {});
                            }
                        });
                    }
                });
            });
        }
    });
}

// Modifica Prodotto
exports.modify_product = function(req, res) {
    var modified = 0;
    if (req.body.name !== undefined && req.body.name !== '') {
        Product.updateOne({code: req.body.code}, {name: req.body.name}, function(err, product) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.description !== undefined && req.body.description !== '') {
        Product.updateOne({code: req.body.code}, {description: req.body.description}, function(err, product) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.price !== undefined && req.body.price !== '') {
        var price = req.body.price * 1;
        Product.updateOne({code: req.body.code}, {price: price}, function(err, product) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.discount !== undefined && req.body.discount !== '') {
        var discount = req.body.discount * 1;
        Product.updateOne({code: req.body.code}, {discount: discount}, function(err, product) { if (err) { res.send(err); }});
        modified ++;
    }
    if (modified > 0) {
        res.json({ message: 'Product Successfully Updated' });
        Product.findOne({code: req.body.code}, function(err, product) {
            User.find({}, function(err, user) {
                if (err) { res.send(err); }
                user.forEach(function(user) {
                    if (user.role == 'user' || user.role == 'guest') {
                        user.cart.forEach(function(item) {
                            if (item.productId == req.body.code) {
                                var quantity = item.quantity * 1;
                                var price = product.price * 1;
                                var discount = product.discount * 1;
                                var name = product.name;
                                User.updateOne({
                                username: user.username
                                }, { $pull: { cart: {
                                    productId: req.body.code,
                                    productName: item.productName,
                                    price: item.price,
                                    discount: item.discount,
                                    quantity: item.quantity
                                }}}, function(err, user) {});
                                User.updateOne({
                                username: user.username
                                }, { $push: { cart: {
                                    productId: req.body.code,
                                    productName: name,
                                    price: price,
                                    discount: discount,
                                    quantity: quantity
                                }}}, function(err, user) {});
                            }
                        });
                    }
                });
            });
        });
    } else {
        res.json({ message: 'NO CHANGE MADE' });
    }
}

// Visualizzazione Utenti
exports.view_users = function(req, res) {
    if (req.body.username !== undefined && req.body.role !== 'all') {
        User.find({
            $and: [
                   {username: {$regex: req.body.username, $options: 'i'}},
                   {role: req.body.role}
            ]}, function(err, user) {
            if (err) { res.send(err); }
            res.json(user);
        });
    } else if (req.body.role !== 'all') {
        User.find({role: req.body.role}, function(err, user) {
            if (err) { res.send(err); }
            res.json(user);
        });
    } else if (req.body.username !== undefined) {
        User.find({username: {$regex: req.body.username, $options: 'i'}}, function(err, user) {
            if (err) { res.send(err); }
            res.json(user);
        });
    } else {
        User.find({}, function(err, user) {
            if (err) { res.send(err); }
            res.json(user);
        });
    }
}

exports.find_cart = function(req, res) {
    User.findOne({username: req.session.username}, function(err, user) {
        if (err) { res.send(err); }
        if (user !== null) {
            res.json(user.cart);
        } else {
            res.json({ message: 'SESSION EXPIRED' });
        }
    });
}

exports.find_orders = function(req, res) {
    User.findOne({username: req.session.username}, function(err, user) {
        if (err) { res.send(err); }
        if (user !== null) {
            res.json(user.orders);
        } else {
            res.json({ message: 'SESSION EXPIRED' });
        }
    });
}

exports.find_user = function(req, res) {
    User.findOne({username: req.session.username}, function(err, user) {
        if (err) { res.send(err); }
        if (user !== null) {
            res.json(user);
        } else {
            res.json({ message: 'SESSION EXPIRED' });
        }
    });
}

// Creazione Utente
exports.create_user = function(req, res) {
    var new_user = new User();
    var phone = 0;
    var discount = 0;
    var password = CryptoJS.MD5(req.body.password);
    new_user.username = req.body.username;
    new_user.password = password;
    new_user.name = req.body.name;
    new_user.surname = req.body.surname;
    new_user.company = req.body.company;
    new_user.mail = req.body.mail;
    if (req.body.phone !== undefined) {
        phone = phone + req.body.phone * 1;
    }
    new_user.phone = phone;
    new_user.role = req.body.role;
    if (req.body.discount !== undefined) {
        discount = discount + req.body.discount * 1;
    }
    new_user.discount = discount;
    new_user.save(function(err, user) {
        if (err) { res.send(err); }
        res.json({ message: 'User Successfully Created' });
    });
}

// Cancellazione Utente
exports.delete_user = function(req, res) {
    User.deleteOne({username: req.body.username}, function (err, result) {
        if(result.deletedCount==0) {
            res.json({ message: 'User NOT Found' });
        } else {
            res.json({ message: 'User Successfully Deleted' });
        }
    });
}

exports.modify_byUser = function(req, res) {
    var error;
    var modified = 0;
    if (req.body.password !== undefined && req.body.password !== '' && req.body.confirmation !== undefined && req.body.confirmation !== '') {
        var password = CryptoJS.MD5(req.body.password);
        if (req.body.password === req.body.confirmation) {
            User.updateOne({username: req.session.username}, {password: password}, function(err, user) { if (err) { res.send(err); }});
            modified ++;
        } else {
            error = true;
            res.json({ message: 'LE PASSWORD NON CORRISPONDONO' });
        }
    }
    if (req.body.name !== undefined && req.body.name !== '') {
        User.updateOne({username: req.session.username}, {name: req.body.name}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.surname !== undefined && req.body.surname !== '') {
        User.updateOne({username: req.session.username}, {surname: req.body.surname}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.company !== undefined && req.body.company !== '') {
        User.updateOne({username: req.session.username}, {company: req.body.company}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.mail !== undefined && req.body.mail !== '') {
        User.updateOne({username: req.session.username}, {mail: req.body.mail}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.phone !== undefined && req.body.phone !== '') {
        var phone = req.body.phone * 1;
        User.updateOne({username: req.session.username}, {phone: phone}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.discount !== undefined && req.body.discount !== '') {
        var discount = req.body.discount * 1;
        User.updateOne({username: req.session.username}, {discount: discount}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (!error && modified > 0) {
        res.json({ message: 'User Successfully Updated' });
    }
    if (!error && modified === 0) {
        res.json({ message: 'NO CHANGE MADE' });
    }
}

// Modifica Utente
exports.modify_user = function(req, res) {
    var error;
    var modified = 0;
    if (req.body.password !== undefined && req.body.password !== '') {
        var password = CryptoJS.MD5(req.body.password);
        User.updateOne({username: req.body.username}, {password: password}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.name !== undefined && req.body.name !== '') {
        User.updateOne({username: req.body.username}, {name: req.body.name}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.surname !== undefined && req.body.surname !== '') {
        User.updateOne({username: req.body.username}, {surname: req.body.surname}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.company !== undefined && req.body.company !== '') {
        User.updateOne({username: req.body.username}, {company: req.body.company}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.mail !== undefined && req.body.mail !== '') {
        User.updateOne({username: req.body.username}, {mail: req.body.mail}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.phone !== undefined && req.body.phone !== '') {
        var phone = req.body.phone * 1;
        User.updateOne({username: req.body.username}, {phone: phone}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (req.body.discount !== undefined && req.body.discount !== '') {
        var discount = req.body.discount * 1;
        User.updateOne({username: req.body.username}, {discount: discount}, function(err, user) { if (err) { res.send(err); }});
        modified ++;
    }
    if (!error && modified > 0) {
        res.json({ message: 'User Successfully Updated' });
    }
    if (!error && modified === 0) {
        res.json({ message: 'NO CHANGE MADE' });
    }
}

// Inserimento e Cancellazione Prodotti da Carrello
exports.modify_cart = function(req, res) {
    if (req.body.mode == "insert") {
        var quantity = req.body.quantity * 1;
        var price = req.body.price * 1;
        var discount = req.body.discount * 1;
        User.findOne({username: req.session.username}, function(err, user) {
            if (err) { res.send(err); }
            var updated = 0;
            user.cart.forEach(function(item) {
                if (item.productId == req.body.productId) {
                    var name = item.productName;
                    var newQuantity = quantity + item.quantity * 1;
                    updated++;
                    User.updateOne({
                    username: user.username
                    }, { $pull: { cart: {
                        productId: req.body.productId,
                        productName: item.productName,
                        price: item.price,
                        discount: item.discount,
                        quantity: item.quantity
                    }}}, function(err, user) {});
                    User.updateOne({
                    username: user.username
                    }, { $push: { cart: {
                        productId: req.body.productId,
                        productName: name,
                        price: price,
                        discount: discount,
                        quantity: newQuantity
                    }}}, function(err, user) {});
                }
            });
            if (updated === 0) {
                User.updateOne({
                    username: req.session.username
                }, { $push: { cart: {
                    productId: req.body.productId,
                    productName: req.body.productName,
                    price: price,
                    discount: discount,
                    quantity: quantity
                }}}, function(err, user) {
                    if (err) { res.send(err); }
                    res.status(201).json(user);
                });
            }
        });
    } else {
        var quantity = req.body.quantity * 1;
        var price = req.body.price * 1;
        var discount = req.body.discount * 1;
        User.updateOne({
            username: req.session.username
        }, { $pull: { cart: {
            productId: req.body.productId,
            productName: req.body.productName,
            price: price,
            discount: discount,
            quantity: quantity
        }}}, function(err, user) {
            if (err) { res.send(err); }
            res.status(201).json(user);
        });
    }
}

exports.request_account = function(req, res) {
    
    //TEST
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ordini.urbitek@gmail.com',
        pass: 'Urbitek2020'
      }
    });
    
    var stringa = '';
    var oggetto = '';
    stringa = 'Recapito: ' + req.body.name + '\nAzienda: ' + req.body.company + '\nMail: ' + req.body.mail + '\nTelefono: ' + req.body.phone + '\n';
            oggetto = 'Richiesta Creazione Account';
    var mailOptions = {
        from: 'ordini.urbitek@gmail.com',
        to: 'mcamporesi@urbitek.it',
        subject: oggetto,
        text: stringa
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.json({ message: 'Richiesta Creata!' });
        }
        });
}

function getCart(username, callback) {
    User.findOne({username: username}, function (err, user) {
        if (err) {
          callback(err, null);
        } else {
            callback(null, user);
        }
    });
}

// Conferma Preventivo-Ordine
exports.create_order = function(req, res) {
    User.findOne({username: req.session.username}, function(err, user) {
        if (user.role == "user") {
            User.updateOne({
                username: req.session.username
            }, { $push: { orders: {
                products: user.cart,
                discount: user.discount
            }}}, function(err, user) {
                if (err) { res.send(err); }
            });
        }
    });
    
    //TEST
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ordini.urbitek@gmail.com',
        pass: 'Urbitek2020'
      }
    });
    
    getCart(req.session.username, function (err, user) {
        if (err) {
          console.log(err);
        }
        var totale = 0;
        var stringa = '';
        var oggetto = '';
        var sconto = 0;
        if (user.role == 'user') {
          stringa = 'Utente: ' + user.username + '\nMail: ' + user.mail + '\nTelefono: ' + user.phone + '\nSconto: ' + user.discount + '%\n';
            oggetto = 'Richiesta Ordine da Sito';
            sconto = user.discount;
        } else {
            stringa = 'Utente: ' + user.username + '\nRecapito: ' + req.body.name + '\nAzienda: ' + req.body.company + '\nMail: ' + req.body.mail + '\nTelefono: ' + req.body.phone + '\n';
            oggetto = 'Richiesta Preventivo da Sito';
        }
        user.cart.forEach(function(item) {
            var newString = '\nCodice Prodotto: ' + item.productId + '\nNome Prodotto: ' + item.productName + '\nPrezzo Unitario: ' + item.price + '€\nSconto: ' + item.discount + '%\nQuantità: ' + item.quantity + '\n';
            stringa = stringa + newString;
            var totaleParziale = (item.price * item.quantity)-((item.price * item.quantity) * (sconto + item.discount) / 100);
            totale = totale + totaleParziale;
            stringa = stringa + 'Totale Parziale: ' + totaleParziale + '€\n';
        });
            stringa = stringa + '\nTotale: ' + totale + '€';
        //console.log(stringa);
        var mailOptions = {
          from: 'ordini.urbitek@gmail.com',
          to: 'mcamporesi@urbitek.it',
          subject: oggetto,
          text: stringa
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    });
    
    // Cancellazione Carrello
    User.updateOne({
        username: req.session.username
    }, { cart: []}, function(err, user) {
        if (err) { res.send(err); }
        res.json({ message: 'Order Successfully Created' });
    });
}
