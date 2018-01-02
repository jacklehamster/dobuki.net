class Api {
    login(username, password, callback) {
        $.ajax({
            type: 'POST',
            url: "/api/login",
            cache: false,
            data: {
                username: username,
                password: password ? md5(`${password} ${username}`) : null,
            },
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
                callback(JSON.parse(result));
            },
            error: (xhr,status,error) => {
                console.error(error);
            }
        });
    }

    logout(username, token, callback) {
        $.ajax({
            type: 'POST',
            url: "/api/logout",
            cache: false,
            data: {
                username: username,
                token: token,
            },
            success: (result,xhr,status) => {
                callback(JSON.parse(result));
            },
            error: (xhr,status,error) => {
                console.error(error);
            }
        });
    }
}

const api = new Api();
