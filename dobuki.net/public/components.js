class Page extends React.Component {
    showTip() {}

    static clearQuery() {
        history.replaceState({}, 'Dobuki', location.href.split("?")[0]);
    }

    static reloadPage() {
        location.replace('');
    }

    static render() {
        return ReactDOM.render(React.createElement(this, null), document.getElementById('root'));
    }
}

class HeaderTitle extends React.Component {
    render() {
        const divStyle = {
            position: 'fixed',
            background: 'linear-gradient(white, silver)',
            borderBottom: '1px solid gray',
            top: 0, height: 50, width: '100%', zIndex: 2
        };

        const h1Style = {
            fontSize: 32,
            fontFamily: 'Fredoka One',
            margin: 0,
            color: '#012',
            textShadow: '1px 1px 0 #FFF',
            cursor: 'pointer'
        };

        const imgStyle = {
            width: 50, height: 50,
            cursor: 'pointer'
        };

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { style: divStyle, className: 'header' },
                React.createElement('img', { style: imgStyle, src: this.props.icon, onClick: Page.reloadPage }),
                React.createElement(
                    'h1',
                    { style: h1Style, onClick: Page.reloadPage },
                    this.props.title
                )
            ),
            React.createElement('div', { style: { height: 51 } })
        );
    }
}

class Overlay extends React.Component {
    render() {
        return React.createElement(
            'div',
            { style: {
                    position: 'absolute',
                    top: 51, left: 0,
                    width: '100%', height: '100%',
                    pointerEvents: this.props.mode ? '' : 'none'
                } },
            this.props.children
        );
    }
}

class LoginDialog extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            login: null,
            username: null,
            usernameConfirmed: false,
            email: null,
            emailConfirmed: false,
            password: null,
            password2: null,
            loggingIn: false,
            signupMessage: null,
            loginMessage: null,
            recoverySent: false,
            resetPassword: false,
            signupWarning: null
        };
        this.state = this.initialState;
        this.performLogin = this.performLogin.bind(this);
        this.signUp = this.signUp.bind(this);
        this.loginUsernameBox = this.loginUsernameBox.bind(this);
        this.resetPasswordBox = this.resetPasswordBox.bind(this);
        this.loginPasswordBox = this.loginPasswordBox.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.sendRecoveryLink = this.sendRecoveryLink.bind(this);
        this.recover = this.recover.bind(this);
        this.checkUsernameAvailable = this.checkUsernameAvailable.bind(this);
    }

    clear() {
        this.setState(this.initialState);
    }

    componentDidMount() {
        if (this.props.mode === 'login' && this.refs.username_field) {
            this.refs.username_field.focus();
        }
    }

    sendRecoveryLink() {
        const self = this;
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
                loginMessage: null
            });
            api.recover(this.state.login, function (result) {
                if (result.success) {
                    self.setState({
                        loggingIn: false,
                        loginMessage: result.message,
                        recoverySent: true
                    });
                } else {
                    self.setState({
                        loggingIn: false,
                        loginMessage: result.message
                    });
                }
            });
        }
    }

    performLogin() {
        const self = this;
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
                loginMessage: null
            });
            api.login(this.state.login, this.state.password || '', function (result) {
                if (result.success) {
                    if (result.password_valid) {
                        session.user = result.username;
                        self.props.onLogin();
                    } else {
                        self.setState({
                            login: result.username,
                            username: result.username,
                            usernameConfirmed: true,
                            loggingIn: false,
                            loginMessage: '',
                            resetPassword: result.reset_password
                        }, function () {
                            self.refs.password_field.focus();
                        });
                    }
                } else {
                    self.setState({
                        loggingIn: false,
                        loginMessage: result.message
                    });
                }
            });
        }
    }

    signupResult(result) {
        if (result.success) {
            this.setState({
                signupMessage: `
                Thank you for signing up. Please check ${this.state.email}
                for a confirmation email.
            `
            });
        } else {
            this.setState({
                loggingIn: false,
                signupWarning: result.message
            });
        }
    }

    recover() {
        this.setState({
            loginMessage: null
        }, function () {
            this.props.recover();
        }.bind(this));
    }

    checkUsernameAvailable(username) {
        api.check(username, function (result) {
            if (!result.success) {
                this.setState({
                    signupWarning: result.message
                });
            }
        }.bind(this));
    }

    signUp() {
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
                signupMessage: null
            });
            api.signup(this.state.username, this.state.email, this.state.password, this.signupResult.bind(this));
        }
    }

    loginChange(e) {
        this.setState({
            login: e.target.value
        });
    }

    usernameChange(e) {
        this.setState(prevState => {
            return {
                signupWarning: null,
                username: e.target.value
            };
        });
    }

    emailChange(e) {
        this.setState(prevState => {
            return {
                signupWarning: null,
                email: e.target.value
            };
        });
    }

    passwordChange(e) {
        const target = e.target;
        this.setState(prevState => {
            const invalid = !LoginDialog.validPassword(target.value);
            const warning = "Your password must have at least eight characters, including one letter and one number.";
            const signupWarning = invalid ? warning : prevState.signupWarning && warning !== prevState.signupWarning ? prevState.signupWarning : null;
            return {
                signupWarning,
                password: target.value
            };
        });
    }

    password2Change(e) {
        const target = e.target;
        this.setState(prevState => {
            const invalid = prevState.password !== target.value;
            const warning = "The password you entered must match.";
            const signupWarning = invalid ? warning : prevState.signupWarning && warning !== prevState.signupWarning ? prevState.signupWarning : null;
            return {
                signupWarning,
                password2: target.value
            };
        });
    }

    static validPassword(password) {
        return (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
        );
    }

    static invalidForm(state) {
        return !state.username || !this.validEmail(state.email) || !this.constructor.validPassword(state.password) || state.password2 !== state.password;
    }

    submitForm(event) {
        if (event.key === 'Enter') {
            this.performLogin();
        }
    }

    loginPasswordBox() {
        const fontFamily = "'Concert One', cursive";
        return [React.createElement('div', { style: { height: 20 } }), React.createElement(
            'div',
            { style: {
                    fontFamily,
                    fontSize: 20,
                    height: 40,
                    display: this.state.usernameConfirmed ? '' : 'none'
                },
                onClick: function () {
                    this.setState({ usernameConfirmed: false });
                }.bind(this)
            },
            this.state.username
        ), React.createElement('input', { type: 'text',
            value: this.state.login, readonly: true, autocomplete: 'off',
            style: { display: 'none' }
        }), React.createElement('input', { ref: 'password_field',
            type: 'password',
            placeholder: 'Enter your password',
            className: 'input',
            onChange: this.passwordChange.bind(this),
            disabled: this.state.loggingIn,
            value: this.state.password,
            onKeyPress: this.submitForm,
            style: {
                height: 40,
                width: '100%'
            } }), React.createElement('div', { style: { height: 20 } }), React.createElement(
            'div',
            { style: {
                    display: 'flex',
                    height: 50,
                    width: '70%'
                } },
            React.createElement(Button, {
                text: 'login',
                leftMost: true, rightMost: true,
                onClick: this.performLogin,
                fontSize: '24',
                fontColor: '#eee',
                background: 'linear-gradient(#59f79d, #2c6846)',
                backgroundPressed: '#a3e2bf',
                pressed: this.state.loggingIn,
                disabled: !this.state.password
            })
        )];
    }

    loginUsernameBox() {
        return [React.createElement('div', { style: { height: 20 } }), React.createElement('input', { ref: 'username_field',
            type: 'text',
            placeholder: 'Enter your username or email',
            className: 'input',
            onChange: this.loginChange.bind(this),
            disabled: this.state.loggingIn,
            value: this.state.login,
            onKeyPress: this.submitForm,
            style: {
                height: 40,
                width: '100%'
            } }), React.createElement('div', { style: { height: 20 } }), React.createElement(
            'div',
            { style: {
                    display: 'flex',
                    height: 50,
                    width: '70%'
                } },
            React.createElement(Button, { text: 'next',
                leftMost: true, rightMost: true,
                onClick: this.performLogin,
                fontSize: '24',
                fontColor: '#eee',
                background: 'linear-gradient(#59f79d, #2c6846)',
                backgroundPressed: '#a3e2bf',
                pressed: this.state.loggingIn,
                disabled: !this.state.login
            })
        )];
    }

    resetPasswordBox() {
        const fontFamily = "'Concert One', cursive";
        return [React.createElement('div', { style: { height: 20 } }), React.createElement(
            'div',
            { style: {
                    fontFamily,
                    fontSize: 20,
                    height: 40,
                    display: this.state.usernameConfirmed ? '' : 'none'
                },
                onClick: (() => {
                    this.setState({ usernameConfirmed: false });
                }).bind(this)
            },
            this.state.username
        ), React.createElement('input', { type: 'text',
            value: this.state.login, readonly: true, autocomplete: 'off',
            style: { display: 'none' }
        }), React.createElement('input', { ref: 'password_field',
            type: 'password',
            placeholder: 'Enter a new password',
            className: 'input',
            onChange: this.passwordChange.bind(this),
            disabled: this.state.loggingIn,
            value: this.state.password,
            onKeyPress: event => {
                if (event.key === 'Enter') {
                    this.refs.password_field2.focus();
                }
            },
            style: {
                height: 40,
                width: '100%'
            } }), React.createElement('div', { style: { height: 20 } }), React.createElement('input', { ref: 'password_field2',
            type: 'password',
            placeholder: 'Re-enter the same password',
            className: 'input',
            onChange: this.password2Change.bind(this),
            disabled: this.state.loggingIn,
            value: this.state.password2,
            onKeyPress: function (event) {
                if (!this.constructor.invalidForm(this.state)) {
                    this.submitForm(event);
                }
            }.bind(this),
            style: {
                height: 40,
                width: '100%'
            } }), React.createElement('div', { style: { height: 20 } }), React.createElement(
            'div',
            { style: {
                    display: 'flex',
                    height: 50,
                    width: '70%'
                } },
            React.createElement(Button, {
                text: 'Change password',
                leftMost: true, rightMost: true,
                onClick: this.performLogin,
                fontSize: '24',
                fontColor: '#eee',
                background: 'linear-gradient(#59f79d, #2c6846)',
                backgroundPressed: '#a3e2bf',
                pressed: this.state.loggingIn,
                disabled: !this.state.password
            })
        )];
    }

    loginSection() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return React.createElement(
            'div',
            { style: {
                    width: '100%',
                    height: 'auto',
                    borderBottomLeftRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
            React.createElement(
                'div',
                { className: 'loginsection' },
                this.state.resetPassword ? this.resetPasswordBox() : this.state.usernameConfirmed ? this.loginPasswordBox() : this.loginUsernameBox(),
                React.createElement(
                    'div',
                    { style: {
                            display: 'flex',
                            marginTop: 20,
                            alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                            'width': 50, 'height': 50
                        } },
                    React.createElement('div', { className: `tux-loading-indicator ${this.state.loggingIn ? 'show' : ''}` })
                ),
                this.state.loginMessage && React.createElement(
                    'div',
                    { style: {
                            fontFamily,
                            fontSize: 20,
                            padding: 20
                        } },
                    this.state.loginMessage
                ),
                !this.state.loggingIn && !this.state.resetPassword && React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'a',
                        { className: 'link', onClick: this.recover },
                        'Did you forget your username or password?'
                    )
                )
            )
        );
    }

    recoverSection() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return React.createElement(
            'div',
            { style: {
                    width: '100%',
                    height: 'auto',
                    borderBottomLeftRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
            React.createElement(
                'div',
                { className: 'loginsection' },
                React.createElement('div', { style: { height: 20 } }),
                React.createElement('input', { ref: 'username_field',
                    type: 'email',
                    placeholder: 'Enter your email',
                    className: 'input',
                    onChange: this.loginChange.bind(this),
                    disabled: this.state.loggingIn || this.state.recoverySent,
                    value: this.state.login,
                    onKeyPress: this.submitForm,
                    style: {
                        height: 40,
                        width: '100%'
                    } }),
                ',',
                React.createElement('div', { style: { height: 20 } }),
                React.createElement(
                    'div',
                    { style: {
                            display: 'flex',
                            height: 50,
                            width: '70%'
                        } },
                    React.createElement(Button, { text: 'send recovery link',
                        leftMost: true, rightMost: true,
                        onClick: this.sendRecoveryLink,
                        fontSize: '24',
                        fontColor: '#eee',
                        background: 'linear-gradient(#59f79d, #2c6846)',
                        backgroundPressed: '#a3e2bf',
                        pressed: this.state.loggingIn || this.state.recoverySent,
                        disabled: !this.state.login || !LoginDialog.validEmail(this.state.login)
                    })
                ),
                React.createElement(
                    'div',
                    { style: {
                            display: 'flex',
                            marginTop: 20,
                            alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                            'width': 50, 'height': 50
                        } },
                    React.createElement('div', { className: `tux-loading-indicator ${this.state.loggingIn ? 'show' : ''}` })
                ),
                this.state.loginMessage && React.createElement(
                    'div',
                    { style: {
                            fontFamily,
                            fontSize: 20,
                            padding: 20
                        } },
                    this.state.loginMessage
                )
            )
        );
    }

    static validEmail(email) {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        );
    }

    signupSection() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return this.state.signupMessage ? React.createElement(
            'div',
            { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
            React.createElement(
                'div',
                { style: {
                        fontFamily,
                        fontSize: 20,
                        padding: 20
                    } },
                this.state.signupMessage
            ),
            React.createElement(
                'div',
                { style: {
                        display: 'flex',
                        height: 50,
                        width: '70%'
                    } },
                React.createElement(Button, { text: 'close',
                    leftMost: true, rightMost: true,
                    onClick: this.props.onClickOut,
                    fontSize: '24',
                    fontColor: '#eee',
                    background: 'linear-gradient(#59f79d, #2c6846)',
                    backgroundPressed: '#a3e2bf'
                })
            )
        ) : React.createElement(
            'div',
            { style: {
                    width: '100%',
                    height: 'auto',
                    borderBottomLeftRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
            React.createElement(
                'div',
                { className: 'loginsection' },
                React.createElement('div', { style: { height: 20 } }),
                React.createElement('input', {
                    ref: input => {
                        this.usernameInput = input;
                    },
                    placeholder: 'Enter a username',
                    className: 'input',
                    onChange: this.usernameChange.bind(this),
                    onBlur: (() => {
                        this.setState(prevState => {
                            this.checkUsernameAvailable(prevState.username);
                            return { usernameConfirmed: prevState.username };
                        });
                    }).bind(this),
                    disabled: this.state.loggingIn,
                    value: this.state.username,
                    onKeyPress: event => {
                        if (event.key === 'Enter') {
                            this.refs.email.focus();
                        }
                    },
                    style: {
                        height: 40,
                        width: '100%',
                        display: this.state.usernameConfirmed ? 'none' : ''
                    } }),
                React.createElement(
                    'div',
                    {
                        className: 'confirmed-input',
                        style: {
                            display: this.state.usernameConfirmed ? '' : 'none'
                        },
                        onClick: (() => {
                            this.setState({ usernameConfirmed: false }, function () {
                                this.usernameInput.focus();
                            }.bind(this));
                        }).bind(this)
                    },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'b',
                            null,
                            'Username:'
                        ),
                        ' ',
                        this.state.username
                    )
                ),
                React.createElement('div', { style: { height: 20 } }),
                React.createElement('input', { ref: 'email', type: 'email',
                    placeholder: 'Enter an email',
                    className: 'input',
                    onChange: this.emailChange.bind(this),
                    onBlur: (() => {
                        this.setState(prevState => {
                            this.checkUsernameAvailable(prevState.email);
                            return { emailConfirmed: this.constructor.validEmail(prevState.email) ? prevState.email : null
                            };
                        });
                    }).bind(this),
                    disabled: this.state.loggingIn,
                    value: this.state.email,
                    onKeyPress: event => {
                        if (event.key === 'Enter') {
                            this.refs.password_field.focus();
                        }
                    },
                    style: {
                        height: 40,
                        width: '100%',
                        display: this.state.emailConfirmed ? 'none' : ''
                    } }),
                React.createElement(
                    'div',
                    {
                        className: 'confirmed-input',
                        style: {
                            display: this.state.emailConfirmed ? '' : 'none'
                        },
                        onClick: (() => {
                            this.setState({ emailConfirmed: false }, function () {
                                this.usernameInput.focus();
                            }.bind(this));
                        }).bind(this)
                    },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'b',
                            null,
                            'Email:'
                        ),
                        ' ',
                        this.state.email
                    )
                ),
                React.createElement('div', { style: { height: 20 } }),
                React.createElement('input', { ref: 'password_field', type: 'password',
                    placeholder: 'Enter a password',
                    className: 'input',
                    onChange: this.passwordChange.bind(this),
                    onBlur: (() => {
                        this.setState({ passwordConfirmed: true });
                    }).bind(this),
                    onFocus: (() => {
                        this.setState({ passwordConfirmed: false });
                    }).bind(this),
                    disabled: this.state.loggingIn,
                    value: this.state.password,
                    onKeyPress: event => {
                        if (event.key === 'Enter') {
                            this.refs.password_field2.focus();
                        }
                    },
                    style: {
                        height: 40,
                        width: '100%',
                        color: this.state.passwordConfirmed && this.state.password !== this.state.password2 ? 'red' : 'black'
                    } }),
                React.createElement('div', { style: { height: 20 } }),
                React.createElement('input', { ref: 'password_field2', type: 'password',
                    placeholder: 'Retype password',
                    className: 'input',
                    onChange: this.password2Change.bind(this),
                    disabled: this.state.loggingIn,
                    value: this.state.password2,
                    onKeyPress: (event => {
                        if (event.key === 'Enter') {
                            this.signUp();
                        }
                    }).bind(this),
                    style: {
                        height: 40,
                        width: '100%'
                    } }),
                !this.state.loggingIn && [React.createElement('div', { style: { height: 20 } }), React.createElement(
                    'div',
                    { style: {
                            display: 'flex',
                            height: 50,
                            width: '70%'
                        } },
                    React.createElement(
                        Button,
                        {
                            text: 'sign up',
                            leftMost: true, rightMost: true,
                            onClick: this.signUp,
                            fontSize: '24',
                            fontColor: '#eee',
                            background: 'linear-gradient(#59f79d, #2c6846)',
                            backgroundPressed: '#a3e2bf',
                            pressed: this.state.loggingIn,
                            disabled: this.constructor.invalidForm(this.state)
                        },
                        React.createElement('i', { right: true })
                    )
                )],
                !this.state.loggingIn && this.state.signupWarning && React.createElement(
                    'div',
                    { style: {
                            color: '#D00',
                            marginTop: 10
                        } },
                    this.state.signupWarning
                ),
                React.createElement(
                    'div',
                    { style: {
                            display: 'flex',
                            marginTop: 20,
                            alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                            'width': 50, 'height': 50
                        } },
                    React.createElement('div', { className: `tux-loading-indicator ${this.state.loggingIn ? 'show' : ''}` })
                )
            )
        );
    }

    render() {
        const borderRadius = 8;
        return React.createElement(
            'div',
            null,
            React.createElement(
                Overlay,
                { mode: this.props.mode },
                this.props.mode && React.createElement(
                    'div',
                    { className: 'overlay' },
                    React.createElement('div', { style: {
                            position: 'fixed',
                            top: 0, left: 0,
                            width: '100%', height: 'calc(100% + 200px)',
                            transition: 'opacity .2s linear',
                            opacity: this.props.mode ? .8 : 0,
                            backgroundColor: '#002',
                            cursor: 'pointer',
                            display: this.props.mode ? '' : 'none'
                        }, onClick: this.props.onClickOut }),
                    React.createElement(
                        'div',
                        { className: 'popdialog' },
                        React.createElement(LoginDialogHeader, { toggle: this.props.toggle, mode: this.props.mode }),
                        React.createElement(
                            'div',
                            { style: { width: '100%', overflow: 'hidden' } },
                            this.props.mode === 'login' && this.loginSection(),
                            this.props.mode === 'signup' && this.signupSection(),
                            this.props.mode === 'recover' && this.recoverSection()
                        )
                    )
                )
            )
        );
    }
}

class Button extends React.Component {
    render() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return !this.props.hidden && React.createElement(
            'div',
            { style: {
                    flex: 1,
                    transition: '.2s',
                    background: this.props.pressed ? this.props.backgroundPressed || '#444466' : this.props.disabled ? 'linear-gradient(white, silver)' : this.props.background || 'linear-gradient(white, gray)',
                    borderLeft: this.props.leftMost ? 0 : '1px solid gray',
                    borderRight: this.props.rightMost ? 0 : '1px solid gray',
                    borderTopLeftRadius: this.props.leftMost ? borderRadius : 0,
                    borderBottomLeftRadius: this.props.leftMost ? borderRadius : 0,
                    borderTopRightRadius: this.props.rightMost ? borderRadius : 0,
                    borderBottomRightRadius: this.props.rightMost ? borderRadius : 0,
                    fontFamily,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    pointerEvents: this.props.pressed ? 'none' : ''
                }, onClick: this.props.disabled ? null : this.props.onClick },
            React.createElement(
                'div',
                { style: {
                        fontSize: this.props.fontSize || 20,
                        color: this.props.pressed ? 'snow' : this.props.disabled ? 'silver' : this.props.fontColor || '#666677'
                    } },
                this.props.text
            )
        );
    }
}

class ButtonBar extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(index) {
        this.props.onClick(index);
    }

    render() {
        const self = this;
        const buttons = this.props.list.map((property, index, array) => {
            const prop = typeof property === 'string' ? { text: property } : property;
            return React.createElement(Button, {
                pressed: self.props.pressed === index,
                onClick: prop.onClick ? prop.onClick : () => {
                    self.onClick(index);
                },
                text: prop.text,
                leftMost: index === 0,
                rightMost: index === array.length - 1
            });
        });
        return React.createElement(
            'div',
            { style: {
                    display: 'flex',
                    height: 50,
                    width: 'calc(100% - 100px)'
                } },
            buttons
        );
    }
}

class LoginDialogHeader extends React.Component {
    render() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return React.createElement(
            'div',
            { style: {
                    width: '100%',
                    height: 100,
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                    background: 'linear-gradient(white, silver)',
                    borderBottom: '1px solid gray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
            this.props.mode === 'recover' ? React.createElement(
                'div',
                { style: {
                        fontFamily,
                        padding: 50
                    } },
                'Please enter your email. We will send you a link to reset your password.'
            ) : React.createElement(ButtonBar, { list: ['login', 'signup'], onClick: this.props.toggle,
                pressed: this.props.mode === 'login' ? 0 : 1
            })
        );
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: this.constructor.loginState(props.url),
            initialMode: this.constructor.loginState(props.url) || 'login'
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
        this.recover = this.recover.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.canUpdateHistory = true;
        window.addEventListener('popstate', this.onUrlChange.bind(this));
    }

    static loginState(url) {
        switch (url) {
            case '/login':
                return 'login';
            case '/signup':
                return 'signup';
            case '/recover':
                return 'recover';
        }
        return '';
    }

    open(mode) {
        this.setState({
            mode: mode
        });
    }

    close() {
        this.setState(prevState => ({
            initialMode: prevState.mode,
            mode: null
        }));
        this.refs.loginDialog.clear();
    }

    onLogin() {
        this.close();
        this.props.onLogin();
    }

    toggle() {
        this.setState((prevState, props) => ({
            mode: prevState.mode === 'login' ? 'signup' : 'login'
        }));
    }

    recover() {
        this.setState({
            mode: 'recover'
        });
    }

    onUrlChange() {
        const mode = this.constructor.loginState(location.pathname);
        if (mode !== this.state.mode) {
            this.canUpdateHistory = false;
            this.setState({ mode });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.mode !== this.state.mode) {
            if (!this.canUpdateHistory) {
                this.canUpdateHistory = true;
            } else {
                history.pushState({ mode: this.state.mode }, this.state.mode || 'Dobuki', `/${this.state.mode || ''}`);
            }
        }
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { style: {
                        position: 'fixed',
                        top: 0, right: 0,
                        margin: '0 8px',
                        display: 'flex',
                        flexDirection: 'row',
                        zIndex: 3
                    } },
                React.createElement(
                    'div',
                    { className: 'button', onClick: (() => this.open('login')).bind(this), style: {
                            width: 50, height: 50,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        } },
                    React.createElement(
                        'div',
                        { style: { fontFamily: "'Concert One', cursive" } },
                        'login'
                    ),
                    React.createElement('img', { style: { width: 32, height: 32 }, src: '/assets/login.svg' })
                ),
                React.createElement(
                    'div',
                    { className: 'button', onClick: (() => this.open('signup')).bind(this), style: {
                            width: 50, height: 50,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        } },
                    React.createElement(
                        'div',
                        { style: { fontFamily: "'Concert One', cursive" } },
                        'signup'
                    ),
                    React.createElement('img', { style: { width: 28, height: 28 }, src: '/assets/signup.svg' })
                )
            ),
            React.createElement(LoginDialog, { ref: 'loginDialog',
                mode: this.state.mode,
                onClickOut: this.close,
                toggle: this.toggle,
                recover: this.recover,
                onLogin: this.onLogin
            })
        );
    }
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: false
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.logout = this.logout.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        let node = event.target;
        while (node) {
            if (node === this.refs.wrapper) {
                return;
            }
            node = node.parentNode;
        }
        this.close();
    }
    profile_pic() {
        return `/profile/${this.props.username}/image.png`;
    }

    open() {
        this.setState(prevState => ({
            view: !prevState.view
        }));
    }

    close() {
        this.setState({
            view: false
        });
    }

    logout() {
        close();
        api.logout(function (result) {
            session.user = null;
            this.props.onLogout();
        }.bind(this));
    }

    render() {
        return React.createElement(
            'div',
            { ref: 'wrapper' },
            React.createElement(
                'div',
                { className: 'button', onClick: this.open, style: {
                        position: 'fixed',
                        top: 0, right: 0,
                        padding: '0 8px',
                        height: 50,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3
                    } },
                React.createElement(
                    'div',
                    { style: {
                            fontFamily: "'Concert One', cursive",
                            fontSize: 16
                        } },
                    this.props.username
                ),
                React.createElement('img', { style: { width: 40, height: 40, margin: '0 0 0 8px' }, src: this.profile_pic() })
            ),
            this.state.view && React.createElement(
                'div',
                { style: {
                        position: 'absolute',
                        backgroundColor: '#555',
                        minWidth: 150,
                        right: 0
                    } },
                React.createElement(
                    'div',
                    { className: 'menu', onMouseDown: this.logout },
                    React.createElement(
                        'div',
                        { style: { fontFamily: "'Concert One', cursive" } },
                        'Log out'
                    )
                )
            )
        );
    }
}

class Tip extends React.Component {
    render() {
        const fontFamily = "'Concert One', cursive";
        return React.createElement(
            'div',
            { style: {
                    position: 'absolute',
                    width: '100%',
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                } },
            React.createElement(
                'div',
                { className: 'statetip', style: {
                        fontFamily,
                        marginTop: this.props.showTip ? 0 : -100,
                        opacity: this.props.showTip ? .9 : 0
                    } },
                this.props.tip
            )
        );
    }
}
//# sourceMappingURL=components.js.map