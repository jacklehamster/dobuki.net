class Api {
    static parseResult(result) {
        try {
            return JSON.parse(result);
        } catch (error) {
            return {
                'success': false,
                'message': 'An unexpected error has occured. We are working on it...',
            };
        }
    }

    login(username, password, callback) {
        $.ajax({
            type: 'POST',
            url: "/api/login",
            cache: false,
            data: {
                username,
                password: password ? md5(`${password} ${username}`) : null,
            },
            success: (result,xhr,status) => {
                callback(Api.parseResult(result));
            },
            error: (xhr,status,error) => {
                console.error(error);
            }
        });
    }

    changePassword(username, password, callback) {
        $.ajax({
            type: 'POST',
            url: "/api/change-password",
            cache: false,
            data: {
                username,
                password: password ? md5(`${password} ${username}`) : null,
            },
            success: (result,xhr,status) => {
                callback(Api.parseResult(result));
            },
            error: (xhr,status,error) => {
                console.error(error);
            }
        });
    }

    check(username, callback) {
        $.ajax({
            type: 'GET',
            url: "/api/check",
            cache: false,
            data: {
                username,
            },
            success: (result,xhr,status) => {
                callback(Api.parseResult(result));
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
                username,
                email,
                password: md5(`${password} ${username}`),
            },
            success: (result,xhr,status) => {
                callback(Api.parseResult(result));
            },
            error: (xhr,status,error) => {
                console.error(error);
            }
        });
    }

    logout(callback) {
        $.ajax({
            type: 'POST',
            url: "/api/logout",
            cache: false,
            success: (result,xhr,status) => {
                callback(Api.parseResult(result));
            },
            error: (xhr,status,error) => {
                console.error(error);
            }
        });
    }

    recover(email, callback) {
        $.ajax({
            type: 'POST',
            url: "/api/recover",
            cache: false,
            data: {
                email,
            },
            success: (result,xhr,status) => {
                callback(Api.parseResult(result));
            },
            error: (xhr,status,error) => {
                console.error(error);
            }
        });
    }

    save(username, profile_image, password, old_password, callback) {
        $.ajax({
            type: 'POST',
            url: "/api/save-profile",
            cache: false,
            data: {
                profile_image,
                password: md5(`${password} ${username}`),
                old_password: md5(`${old_password} ${username}`),
            },
            success: (result,xhr,status) => {
                callback(Api.parseResult(result));
            },
            error: (xhr,status,error) => {
                console.error(error);
            }
        });
    }
}

const api = new Api();
