let auth = require('../../utils/auth');
const firebase = require('firebase')
const logger = require("../../bin/logger")

exports.register = (req, res, next) => {
    auth.createUserWithEmailAndPassword(req.body.email, req.body.password).then((data) => {
        console.log('CCCCCCCCC', data.user)
        console.log('AAAAAAAAA', JSON.parse(data.user))
        console.log('BBBBBBBB', data.err)
        try {
            if(!data.err) {
                var user = JSON.parse(data).user
                firebase.database().ref('users/' + user.uid).set({
                    displayName: req.body.name,
                  }, function(error) {
                    if (error) {
                        logger.error(error)
                        res.status(400).send({
                            message: error.message
                        })
                    } else {
                        logger.info(req.body.name)
                        res.status(201).send({
                            user: req.body.name,
                            message: "User created successfully"
                        })
                    }
                  });
                } else {
                    logger.error(data.err)
                    res.status(400).send({
                        message: data.err
                    })
                }
        } catch (error) {
            logger.error(error)
            res.status(400).send({
                message: error
            })
        }
        
    }).catch((error) => {
        logger.error(error.message)
    })
}
exports.login = (req, res, next) => {
    auth.SigUpWithEmailAndPassword(req.body.email, req.body.password)
    .then((login) => {
        if(!login.err) {
            firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                res.status(200).send({token: idToken})
              }).catch(function(error) {
                logger.error(error)
              });
        } else {
            res.status(401).send(login.err)
            logger.error(login.err)
        }
    })
}

exports.logout = (req, res, next) => {
    firebase.auth().signOut().then(function() {
        res.status(200).send({messge: "Logout successful"})
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
        res.status(401).send(error)
        logger.error(error)
      });
}