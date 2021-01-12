var userid;
var rate = 1.75;
var currentBill;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var userDiv = document.getElementById("user_div");
        if (userDiv != null) {
            document.getElementById("user_div").style.display = "block";
            document.getElementById("login_div").style.display = "none";
            document.getElementById("signup_div").style.display = "none";
        }

        var user = firebase.auth().currentUser;

        if (user != null) {

            var email_id = user.email;
            var currentReading = 0;
            userid = user.uid;
            var userParaDiv = document.getElementById("user_para");

            if (userParaDiv != null) {
                var nameRef = firebase.database().ref('/Users/' + userid + '/Name/');
                nameRef.on('value', function(snapshot) {
                    userParaDiv.innerHTML = "Welcome : " + snapshot.val();
                });
            }


            var leadsRef = firebase.database().ref('/Users/' + userid + '/CurrentReading/');
            leadsRef.on('value', function(snapshot) {
                currentReading = snapshot.val();
                var currentReadingDiv = document.getElementById("current_reading");
                if (currentReadingDiv != null) {
                    currentReadingDiv.innerHTML = currentReading + " Kw/h";
                }
                currentBill = addZeroes(currentReading * rate);
                document.getElementById("current_bill").innerHTML = currentBill + " AUD";
            });
        }

    } else {
        // No user is signed in.
        var userDiv = document.getElementById("user_div");
        if (userDiv != null) {
            userDiv.style.display = "none";
            document.getElementById("login_div").style.display = "block";
        }


    }
});

function login() {
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

}


function signup() {
    var userEmail = document.getElementById("email_signup_field").value;
    var userPass = document.getElementById("password_signup_field").value;
    var userName = document.getElementById("name_signup_field").value;
    var meterNo = document.getElementById("meterno_signup_field").value;
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
        .then((user) => {
            console.log(user);
            firebase.database().ref('Users/' + user.uid).set({
                Name: userName,
                CurrentReading: 0,
                MeterNumber: meterNo
            });
            login();
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
}

function logout() {
    firebase.auth().signOut();
}

function addZeroes(num) {
    return num.toFixed(2);
}

function gotoPayment() {
    window.location = "payment.html";
}

function gotoSignup() {
    document.getElementById("login_div").style.display = "none";
    document.getElementById("signup_div").style.display = "block";
}

function gotoLogin() {
    document.getElementById("login_div").style.display = "block";
    document.getElementById("signup_div").style.display = "none";
}

function pay() {
    var name = document.getElementById("name").value;
    var cardNumber = document.getElementById("cardnumber").value;
    var expirationdate = document.getElementById("expirationdate").value;
    var securitycode = document.getElementById("securitycode").value;
    var timestamp = new Date();
    firebase.database().ref('Users/' + userid + '/Card').set({
        username: name,
        cardnumber: cardNumber,
        expirationdate: expirationdate,
        securitycode: securitycode
    });

    firebase.database().ref('Users/' + userid + '/Payments/' + timestamp).set({
        cardnumber: cardNumber,
        amount: currentBill + " AUD"
    });

    firebase.database().ref('/Users/' + userid).update({
        CurrentReading: 0
    });
    alert("Payment Completed ");
    window.location = "index.html";
}