class Api {
    login(username, password, callback) {
        var data = { username: username };
        if (password) {
            data.time = Date.now();
            data.password = md5(md5(password) + data.time);
        }

        $.ajax({
            type: 'POST',
            url: "/api/login",
            cache: false,
            data: data,
            success: (result,xhr,status) => {
                callback(JSON.parse(result));
            },
            error: (xhr,status,error) => {
                console.error(error);
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
