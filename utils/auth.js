// let logger   = require(process.cwd() + '/bin/logger.js');
let firebase    = require('firebase')

var config = {
  apiKey: "AIzaSyAwr3qOSeYJF-0FbdTNyFl1r9_2Sv65Llg",
  authDomain: "adopets-930a4.firebaseapp.com",
  databaseURL: "https://adopets-930a4.firebaseio.com",
  projectId: "adopets-930a4",
  storageBucket: "adopets-930a4.appspot.com",
  messagingSenderId: "765900326131",
  appId: "1:765900326131:web:15c7c8b6ccebf5d88ce386",
  measurementId: "G-S8QMJCRCRB"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

module.exports.SigUpWithEmailAndPassword = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if(errorCode == 'auth/wrong-password'){
      return {err: 'Wrong password.'}
    } else {
      return {err: errorMessage}
    }
    return {err: error}
  })
}

module.exports.createUserWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((user) => {
    console.log("$$$$$$$$$$$$$", user)
    return user
  })
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if(errorCode == 'auth/weak-password'){
      return {err: 'The password is too weak.'}
    } else {
      return {err: errorMessage}
    }
  })
  
}


return module.exports