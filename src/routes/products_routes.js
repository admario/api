module.exports = function (app) {

    let products = app.src.controllers.products_controller;
    
    app.post('/api/products/register', products.register);
    app.post('/api/products/list', products.list);
    app.put('/api/products/update', products.update)
    app.delete('/api/products/delete', products.delete)


}