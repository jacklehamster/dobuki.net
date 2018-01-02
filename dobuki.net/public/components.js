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
            background: 'linear-gradient(white, silver)',
            borderBottom: '1px solid gray',
            height: 50
        };

        const h1Style = {
            fontSize: 32,
            fontFamily: "'Fredoka One', cursive",
            margin: 0,
            color: '#012',
            textShadow: '1px 1px 0 #FFF',
            cursor: 'pointer'
        };

        const imgStyle = {
            width: 50,
            height: 50,
            cursor: 'pointer'
        };

        return React.createElement(
            'div',
            { style: divStyle, className: 'header' },
            React.createElement('img', { style: imgStyle, src: this.props.icon, onClick: Page.reloadPage }),
            React.createElement(
                'h1',
                { style: h1Style, onClick: Page.reloadPage },
                this.props.title
            )
        );
    }
}

class Overlay extends React.Component {
    render() {
        return React.createElement(
            'div',
            { style: {
                    position: 'absolute',
                    top: 0, left: 0,
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
            loginMessage: null
        };
        this.state = this.initialState;
        this.performLogin = this.performLogin.bind(this);
        this.signUp = this.signUp.bind(this);
        this.loginUsernameBox = this.loginUsernameBox.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
    }

    clear() {
        this.setState(this.initialState);
    }

    performLogin() {
        const self = this;
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true
            });
            api.login(this.state.login, this.state.password || '', function (result) {
                if (result.success) {
                    if (result.token) {
                        const username = self.state.login;
                        const token = result.token;
                        const date = new Date();
                        const days = 1;
                        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

                        document.cookie = `username=${username}; expires=${date.toGMTString()}`;
                        document.cookie = `token=${token}; expires=${date.toGMTString()}`;

                        localStorage.setItem('username', username);
                        localStorage.setItem('token', token);
                        self.props.onLogin();
                    } else {
                        self.setState({
                            login: result.username,
                            username: result.username,
                            usernameConfirmed: true,
                            loggingIn: false,
                            loginMessage: ''
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

    signupSuccess() {
        this.setState({
            signupMessage: `
                Thank you for signing up. Please check ${this.state.email}
                for a confirmation email.
            `
        });
    }

    signUp() {
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true
            });
            api.signup(this.state.username, this.state.email, this.state.password, this.signupSuccess.bind(this));
        }
    }

    loginChange(e) {
        this.setState({
            login: e.target.value
        });
    }

    usernameChange(e) {
        this.setState({
            username: e.target.value
        });
    }

    emailChange(e) {
        this.setState({
            email: e.target.value
        });
    }

    passwordChange(e) {
        this.setState({
            password: e.target.value
        });
    }

    password2Change(e) {
        this.setState({
            password2: e.target.value
        });
    }

    invalidForm(state) {
        return !state.username || !state.email || !state.password || state.password2 !== state.password;
    }

    loginPasswordBox() {
        const fontFamily = "'Concert One', cursive";
        return [React.createElement('div', { style: { height: 20 } }), React.createElement(
            'div',
            {
                className: 'confirmed-input',
                style: {
                    fontFamily,
                    fontSize: 20,
                    height: 40,
                    padding: 8,
                    display: this.state.usernameConfirmed ? '' : 'none'
                },
                onClick: (() => {
                    this.setState({ usernameConfirmed: false });
                }).bind(this)
            },
            this.state.username
        ), React.createElement('input', {
            type: 'password',
            placeholder: 'Enter your password',
            className: 'input',
            onChange: this.passwordChange.bind(this),
            disabled: this.state.loggingIn,
            value: this.state.password,
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
                fontColor: '#333',
                background: 'linear-gradient(#59f79d, #2c6846)',
                backgroundPressed: '#a3e2bf',
                pressed: this.state.loggingIn,
                disabled: !this.state.password
            })
        )];
    }

    loginUsernameBox() {
        return [React.createElement('div', { style: { height: 20 } }), React.createElement('input', { type: 'text',
            placeholder: 'Enter your username or email',
            className: 'input',
            onChange: this.loginChange.bind(this),
            disabled: this.state.loggingIn,
            value: this.state.login,
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
                fontColor: '#333',
                background: 'linear-gradient(#59f79d, #2c6846)',
                backgroundPressed: '#a3e2bf',
                pressed: this.state.loggingIn,
                disabled: !this.state.login
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
                this.state.usernameConfirmed ? this.loginPasswordBox() : this.loginUsernameBox(),
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

    signupSection() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return this.state.signupMessage ? React.createElement(
            'div',
            { style: {
                    fontFamily,
                    fontSize: 20,
                    padding: 20
                } },
            this.state.signupMessage
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
                            return { usernameConfirmed: prevState.username };
                        });
                    }).bind(this),
                    disabled: this.state.loggingIn,
                    value: this.state.username,
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
                            height: 40,
                            padding: 8,
                            display: this.state.usernameConfirmed ? '' : 'none'
                        },
                        onClick: (() => {
                            this.setState({ usernameConfirmed: false });
                        }).bind(this)
                    },
                    React.createElement(
                        'b',
                        null,
                        'Username:'
                    ),
                    ' ',
                    this.state.username
                ),
                React.createElement('div', { style: { height: 20 } }),
                React.createElement('input', { type: 'email',
                    placeholder: 'Enter an email',
                    className: 'input',
                    onChange: this.emailChange.bind(this),
                    onBlur: (() => {
                        this.setState(prevState => {
                            return { emailConfirmed: prevState.email };
                        });
                    }).bind(this),
                    disabled: this.state.loggingIn,
                    value: this.state.email,
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
                            height: 40,
                            padding: 8,
                            display: this.state.emailConfirmed ? '' : 'none'
                        },
                        onClick: (() => {
                            this.setState({ emailConfirmed: false });
                        }).bind(this)
                    },
                    React.createElement(
                        'b',
                        null,
                        'Email:'
                    ),
                    ' ',
                    this.state.email
                ),
                React.createElement('div', { style: { height: 20 } }),
                React.createElement('input', { type: 'password',
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
                    style: {
                        height: 40,
                        width: '100%',
                        color: this.state.passwordConfirmed && this.state.password !== this.state.password2 ? 'red' : 'black'
                    } }),
                React.createElement('div', { style: { height: 20 } }),
                React.createElement('input', { type: 'password',
                    placeholder: 'Retype password',
                    className: 'input',
                    onChange: this.password2Change.bind(this),
                    disabled: this.state.loggingIn,
                    value: this.state.password2,
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
                            fontColor: '#333',
                            background: 'linear-gradient(#59f79d, #2c6846)',
                            backgroundPressed: '#a3e2bf',
                            pressed: this.state.loggingIn,
                            disabled: this.invalidForm(this.state)
                        },
                        React.createElement('i', { right: true })
                    )
                )],
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
                            width: '100%', height: '100%',
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
                            this.props.mode === 'signup' && this.signupSection()
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
            React.createElement(ButtonBar, { list: ['login', 'signup'], onClick: this.props.toggle,
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
        this.onLogin = this.onLogin.bind(this);
        this.canUpdateHistory = true;
        window.addEventListener('popstate', this.onUrlChange.bind(this));
    }

    static loginState(url) {
        return url === '/login' ? 'login' : url === '/signup' ? 'signup' : '';
    }

    open() {
        this.setState(prevState => ({
            mode: prevState.initialMode
        }));
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
                { className: 'button', onClick: this.open, style: {
                        position: 'absolute',
                        top: 0, right: 0,
                        margin: '0 8px',
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
                React.createElement('img', { style: { width: 32, height: 32 }, src: '/assets/signin.svg' })
            ),
            React.createElement(LoginDialog, { ref: 'loginDialog',
                mode: this.state.mode,
                onClickOut: this.close,
                toggle: this.toggle,
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
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        console.log(username, token);
        api.logout(username, token, function (result) {
            console.log(result);
        });
    }

    render() {
        return React.createElement(
            'div',
            { ref: 'wrapper' },
            React.createElement(
                'div',
                { className: 'button', onClick: this.open, style: {
                        position: 'absolute',
                        top: 0, right: 0,
                        padding: '0 8px',
                        height: 50,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
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
//# sourceMappingURL=components.js.map