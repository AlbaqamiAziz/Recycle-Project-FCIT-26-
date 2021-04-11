const chai = window.chai
const expect = chai.expect

describe('isValidEmail', () => {
    it('should return true because the email is CORRECT', () => {
        expect(isValidEmail('meshal@hotmail.com')).to.deep.equal(true);
    })
})

describe('isValidPhone', () => {
    it('should return false because the phone is WRONG', () => {
        expect(isValidPhone('569813231')).to.deep.equal(false);
    })
})

describe('sessionLogin', () => {
    it('should return status code 401 Unauthorized client', () => {
        fetch('localhost:3000/sessionLogin/', {
            method: "POST"
        }).then(
            function (response) {
                expect(response.status).to.deep.equal(401)
            }
        )
    })
})

describe('sessionLogin', () => {
    it('should return status code 200 OK', () => {
        var email = 's@gmail.com';
        var password = '123456';
        firebase.auth().signInWithEmailAndPassword(email, password).then(({ user }) => {
            user.getIdToken().then((idToken) => {
                fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({ idToken }),
                }).then(
                    function (response) {
                        expect(response.status).to.deep.equal(200)
                    }
                )
            })
        })
    })
})
