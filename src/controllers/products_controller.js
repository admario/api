const firebase = require('firebase')
const uuid = require('uuid');
const logger = require('../../bin/logger')

exports.register = (req, res, next) => {
    var newPoductKey = firebase.database().ref().child('products').push().key;
    firebase.database().ref('products/' + newPoductKey).set({
        uuid: uuid.v1(),
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
      }, function(error) {
        if (error) {
            logger.error(error)
        }
      }).then(() => {
        res.status(201).send({
            message: "Product created successfully"
        })
      });
}

exports.list = (req, res, next) => {
    var ref = firebase.database().ref('products');
    ref.once('value', (snapshot) => {
        var data = Object.values(snapshot.val())

        var productsFiltered = data.filter((product) => {
            return product.name.indexOf(req.body.filter) !== -1 
            || product.description.indexOf(req.body.filter) !== -1 
            || product.category.indexOf(req.body.filter) !== -1
        })
        res.status(200).send(productsFiltered)
    })
    
}

exports.update = (req, res, next) => {
    console.log(req.query.uuid)
    var ref = firebase.database().ref('products');
    ref.orderByChild('uuid').equalTo(req.query.uuid).once('value', (snapshot) => {
        var key = Object.keys(snapshot.val())[0]
        
        firebase.database().ref('products/' + key).update({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock
          }, function(error) {
            if (error) {
                logger.error(error)
            }
          }).then(() => {
            res.status(200).send({
                message: "Product updated successfully"
            })
          });
    })
}

exports.delete = (req, res, next) => {
    console.log(req.query.uuid)
    var ref = firebase.database().ref('products');
    ref.orderByChild('uuid').equalTo(req.query.uuid).once('value', (snapshot) => {
        var key = Object.keys(snapshot.val())[0]
        
        firebase.database().ref('products/' + key).remove().then(() => {
            res.status(201).send({
                message: "Product deleted successfully"
            })
          });
    })
}