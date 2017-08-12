class Api {
    login(username, password) {
        $.ajax({
            type: 'POST',
            url: "/api/login",
            cache: false,
            data: {
                username: username,
                password: password? md5(password) : null,
            },
            success: (result,xhr,status) => {
                console.log(result);
            },
            error: (xhr,status,error) => {
            }
        });
    }

    signup(username, email, password, callback) {
        $.ajax({
            type: 'POST',
            url: "/api/signup",
            cache: false,
            data: {
                username: username,
                email: email,
                password: password,
            },
            success: (result,xhr,status) => {
                console.log(result);
                callback(JSON.parse(result));
            },
            error: (xhr,status,error) => {
            }
        });
    }
}

const api = new Api();
