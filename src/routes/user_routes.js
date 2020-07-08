module.exports = function (app) {

    let user = app.src.controllers.user_controllers;
    
    app.post('/api/user/register', user.register);
    app.post('/api/login', user.login);
    app.post('/api/logout', user.logout)


}