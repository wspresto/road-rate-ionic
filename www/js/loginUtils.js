var loginUtils = (function (){
    var config = {
        apiKey: "AIzaSyDRaQNaGdU0RZNXZEAciKlL2xtmSfMM-_M",
        authDomain: "road-rate.firebaseapp.com",
        databaseURL: "https://road-rate.firebaseio.com",
        storageBucket: "road-rate.appspot.com",
        messagingSenderId: "452486727320"
    };
    firebase.initializeApp(config);

    return {
        isUserValid: function () {
            if (!firebase.auth().currentUser) {
                var provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('https://www.googleapis.com/auth/plus.login');

                firebase.auth().signInWithPopup(provider).then(function(result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;

                    document.getElementById('quickstart-oauthtoken').textContent = token;
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    var email = error.email;
                    var credential = error.credential;
                    if (errorCode === 'auth/account-exists-with-different-credential') {
                        alert('You have already signed up with a different auth provider for that email.');
                        // If you are using multiple auth providers on your app you should handle linking
                        // the user's accounts here.
                    } else {
                        console.error(error);
                    }
                });
                return true;
            } else {
                firebase.auth().signOut();
                return false;
            }
        },
        checkAuthStateChange: function () {
            firebase.auth().onAuthStateChanged(function(user){
                if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;

                } else {
                // User is signed out.
                
                }
            });
        }

    };
  
}();