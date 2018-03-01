class Page extends React.Component {
    constructor(props) {
        super(props);
        Page.consumeParams();
    }

    static consumeParams() {
        Page.originalParams = location.search.substring(1).split("&").reduce(
            (map, obj) => {
                const [,key, value] = obj.match(/^(\w+)=([^?&]+|)$/) || [];
                if(key) {
                    map[key] = value;
                }
                return map;
            }, {}
        );
    }

    showTip() {}

    static clearQuery(replacement) {
        const search = replacement && replacement.length ? `?${replacement}` : '';
        history.replaceState({},
            'Dobuki',
            `${location.href.split("?")[0]}${search}`
        );
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
            top: 0, height: 50, width: '100%', zIndex: 2,
        };

        const h1Style = {
            fontSize: 32,
            fontFamily: 'Fredoka One',
            margin: 0,
            color: '#012',
            textShadow: '1px 1px 0 #FFF',
            cursor: 'pointer',
        };

        const imgStyle = {
            width: 50, height: 50,
            cursor: 'pointer',
        };

        return (<div>
            <div style={divStyle} className="header">
                <img style={imgStyle} src={this.props.icon} onClick={Page.reloadPage}/>
                <h1 style={h1Style} onClick={Page.reloadPage}>{this.props.title}</h1>
            </div>
            <div style={{ height: 51 }}/>
        </div>);
    }
}

class Overlay extends React.Component {
    render() {
        return <div style={{
            position: 'absolute',
            top: 51, left: 0,
            width: '100%', height: 'auto',
            pointerEvents: this.props.visible ? '' : 'none',
        }}>
            { this.props.children }
        </div>
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
            warning: null,
            passwordWeak: null,
            passwordMismatch: null,
            usernameTaken: null,
            emailExists: null,
        };
        this.state = {};
        for (let k in this.initialState) {
            this.state[k] = this.initialState[k];
        }
        if (this.props.mode === 'reset-password' && Page.originalParams.username) {
            this.state.login = this.state.username = Page.originalParams.username;
            this.state.usernameConfirmed = true;
        }

        this.performLogin = this.performLogin.bind(this);
        this.performResetPassword = this.performResetPassword.bind(this);
        this.signUp = this.signUp.bind(this);
        this.loginUsernameBox = this.loginUsernameBox.bind(this);
        this.resetPasswordBox = this.resetPasswordBox.bind(this);
        this.loginPasswordBox = this.loginPasswordBox.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.password2Change = this.password2Change.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.sendRecoveryLink = this.sendRecoveryLink.bind(this);
        this.recover = this.recover.bind(this);
        this.checkUsernameAvailable = this.checkUsernameAvailable.bind(this);
    }

    clear() {
        this.setState(this.initialState);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.mode !== nextProps.mode) {
            this.setState({
                password: null,
                password2: null,
            });
        }
    }

    sendRecoveryLink() {
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
                loginMessage: null,
            });
            api.recover(this.state.login, (result) => {
                if(result.success) {
                    this.setState({
                        loggingIn: false,
                        loginMessage: result.message,
                        recoverySent: true,
                    });
                } else {
                    this.setState({
                        loggingIn: false,
                        loginMessage: result.message,
                    });
                }
            });
        }
    }

    performLogin() {
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
                loginMessage: null,
            });
            api.login(this.state.login, this.state.password || '', (result) => {
                if(result.success) {
                    if(result.password_valid) {
                        session.user = result.username;
                        this.props.onLogin();
                    } else {
                        this.setState((prevState) => {
                            return {
                                login: result.username,
                                username: result.username,
                                usernameConfirmed: true,
                                loggingIn: false,
                                loginMessage: '',
                            };
                        }, () => {
                            if(result.reset_password) {
                                this.props.resetPassword();
                            }
                        });
                    }
                } else {
                    this.setState({
                        loggingIn: false,
                        loginMessage: result.message,
                    });
                }
            });
        }
    }

    performResetPassword() {
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
                loginMessage: null,
            });
            api.changePassword(this.state.login, this.state.password || '', (result) => {
                if(result.success) {
                    session.user = result.username;
                    this.props.onLogin();
                } else {
                    this.setState({
                        loggingIn: false,
                        loginMessage: result.message,
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
            `,
            });
        } else {
            this.setState({
                loggingIn: false,
                warning: result.message,
            });
        }
    }

    recover() {
        this.setState({
            login: null,
            loginMessage: null,
        }, function() {
            this.props.recover();
        }.bind(this));
    }

    checkUsernameAvailable(username) {
        api.check(username, (result) => {
            if(!result.success) {
                const prop = result.type==='username' ? 'usernameTaken' : 'emailExists';
                this.setState({
                    [prop]: result.message,
                });
            }
        });
    }

    signUp() {
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
                signupMessage: null,
            });
            api.signup(
                this.state.username,
                this.state.email,
                this.state.password,
                this.signupResult.bind(this),
            );
        }
    }

    loginChange(e) {
        const target = e.target;
        this.setState({
            login: target.value,
        });
    }

    usernameChange(e) {
        const target = e.target;
        this.setState((prevState) => {
            return {
                usernameTaken: null,
                username: target.value,
            }
        });
    }

    emailChange(e) {
        const target = e.target;
        this.setState((prevState) => {
            return {
                emailExists: null,
                email: target.value,
            };
        });
    }

    getWarning() {
        if (this.state.loggingIn) {
            return null;
        }
        return this.state.warning
            || this.state.passwordMismatch
            || this.state.passwordWeak
            || this.state.emailExists
            || this.state.usernameTaken;
    }

    passwordChange(e) {
        const target = e.target;
        this.setState((prevState) => {
            return {
                passwordWeak: !LoginDialog.validPassword(target.value)
                    ? "Your password must have at least eight characters, including one letter and one number."
                    : null,
                password: target.value,
            };
        });
    }

    password2Change(e) {
        const target = e.target;
        this.setState((prevState) => {
            return {
                passwordMismatch: prevState.password !== target.value
                    ? "The passwords you entered must match." : null,
                password2: target.value,
            };
        });
    }
    
    static validPassword(password) {
        return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
    }

    static invalidForm(state) {
        return !state.username
            || !this.validEmail(state.email)
            || !this.validPassword(state.password)
            || state.password2 !== state.password
            || state.usernameTaken
            || state.emailExists;
    }

    submitForm(event) {
        if(event.key === 'Enter'){
            if (this.props.mode==='reset_password') {
                this.performResetPassword();
            } else {
                this.performLogin();
            }
        }
    }

    loginUsernameBox() {
        return [
            <div style={{ height: 20 }}/>,
            <input ref={input => input && input.focus()}
                   type="text"
                   placeholder="Enter your username or email"
                   className="input"
                   onChange={this.loginChange.bind(this)}
                   disabled={this.state.loggingIn}
                   value={this.state.login}
                   onKeyPress={this.submitForm}
                   style={{
                       height: 40,
                       width: '100%',
                   }}/>,
            <div style={{ height: 20 }}/>,
            <div style={{
                display: 'flex',
                height: 50,
                width: '70%',
            }}>
                <Button text="next"
                        leftMost rightMost
                        onClick={this.performLogin}
                        fontSize="24"
                        fontColor="#eee"
                        background={"linear-gradient(#59f79d, #2c6846)"}
                        backgroundPressed="#a3e2bf"
                        pressed={this.state.loggingIn}
                        disabled={!this.state.login}
                />
            </div>,
        ];
    }

    profile_pic() {
        return `/profile-picture/${this.state.username}/image.png`;
    }

    loginPasswordBox() {
        const fontFamily = "'Concert One', cursive";
        return [
            <div style={{ height: 20 }}/>,
            <div ref="profile_pic" className="profile-pic"
                 style={{
                     backgroundImage: `url(${this.profile_pic()})`,
                     backgroundPositionX: this.state.profileX,
                     backgroundPositionY: this.state.profileY,
                 }}/>,
            <div style={{
                    fontFamily,
                    fontSize: 20,
                    height: 40,
                    display: this.state.usernameConfirmed ? '' : 'none',
                }}
                onClick={() => {
                    this.setState({
                        usernameConfirmed: false,
                        password: null,
                    });
                }}>{ this.state.username }</div>,
            <input type="text"
               value={this.state.login} readonly autocomplete="off"
               style={{ display: 'none' }}
            />,
            <input ref={input => input && input.focus()}
                type="password"
                placeholder="Enter your password"
                className="input"
                onChange={this.passwordChange.bind(this)}
                disabled={this.state.loggingIn}
                value={this.state.password}
                onKeyPress={this.submitForm}
                style={{
                    height: 40,
                    width: '100%',
                }}/>,
            <div style={{ height: 20 }}/>,
            <div style={{
                display: 'flex',
                height: 50,
                width: '70%',
            }}>
                <Button
                    text="login"
                    leftMost rightMost
                    onClick={this.performLogin}
                    fontSize="24"
                    fontColor="#eee"
                    background={"linear-gradient(#59f79d, #2c6846)"}
                    backgroundPressed="#a3e2bf"
                    pressed={this.state.loggingIn}
                    disabled={!this.state.password}
                />
            </div>,
        ];
    }

    resetPasswordBox() {
        const fontFamily = "'Concert One', cursive";
        return [
            <div style={{ height: 20 }}/>,
            <div style={{
                fontFamily,
                fontSize: 20,
                height: 40,
                display: this.state.usernameConfirmed ? '' : 'none',
            }}
                 onClick={() => { this.setState({ usernameConfirmed: false }); }}
            >{ this.state.username }</div>,
            <input type="text" value={this.state.login} readonly autocomplete="off"
               style={{ display: 'none' }}
            />,
            <input
               type="password"
               placeholder="Enter a new password"
               className="input"
               onChange={this.passwordChange.bind(this)}
               disabled={this.state.loggingIn}
               value={this.state.password}
               onKeyPress={(event) => {
                   if(event.key === 'Enter'){
                       this.refs.password_field2.focus();
                   }
               }}
               style={{
                   height: 40,
                   width: '100%',
               }}/>,
            <div style={{ height: 10 }}/>,
            <input ref="password_field2"
               type="password"
               placeholder="Re-enter the same password"
               className="input"
               onChange={this.password2Change.bind(this)}
               disabled={this.state.loggingIn}
               value={this.state.password2}
               onKeyPress={(event) => {
                   if(!this.constructor.invalidForm(this.state)) {
                       this.submitForm(event);
                   }
               }}
               style={{
                   height: 40,
                   width: '100%',
               }}/>,
            <div style={{ height: 20 }}/>,
            <div style={{
                display: 'flex',
                height: 50,
                width: '70%',
            }}>
                <Button
                    text="Change password"
                    leftMost rightMost
                    onClick={this.performResetPassword}
                    fontSize="24"
                    fontColor="#eee"
                    background={"linear-gradient(#59f79d, #2c6846)"}
                    backgroundPressed="#a3e2bf"
                    pressed={this.state.loggingIn}
                    disabled={
                        !LoginDialog.validPassword(this.state.password)
                        || this.state.password2 !== this.state.password
                    }
                />
            </div>,
            <div style={{
                color: '#D00',
                marginTop: 15,
            }}>{this.getWarning()}</div>,
        ];
    }

    loginSection() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return (<div style={{
            width: '100%',
            height: 'auto',
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className="loginsection">
                {
                    this.props.mode === 'reset-password' && this.state.username && this.state.usernameConfirmed
                    ? this.resetPasswordBox()
                    : this.state.usernameConfirmed
                    ? this.loginPasswordBox()
                    : this.loginUsernameBox()
                }
                <div style={{
                    display: 'flex',
                    marginTop: 20,
                    alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                    width: 50, height: 50,
                }}>
                    <div className={
                        `tux-loading-indicator ${this.state.loggingIn?'show':''}`
                    }>
                    </div>
                </div>
                { this.state.loginMessage &&  <div style={{
                        fontFamily,
                        fontSize: 20,
                        padding: 20,
                    }}>
                        { this.state.loginMessage }
                    </div>
                }
                { !this.state.loggingIn && this.props.mode!=='reset-password' &&
                    <div><a className="link" onClick={this.recover}>
                        Did you forget your password?
                    </a></div>
                }
            </div>
        </div>);
    }

    recoverSection() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return (<div style={{
            width: '100%',
            height: 'auto',
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className="loginsection">
                <div style={{ height: 20 }}/>
                <input ref={input => input && input.focus()}
                   type="email"
                   placeholder="Enter your email"
                   className="input"
                   onChange={this.loginChange.bind(this)}
                   disabled={this.state.loggingIn || this.state.recoverySent}
                   value={this.state.login}
                   onKeyPress={this.submitForm}
                   style={{
                       height: 40,
                       width: '100%',
                   }}/>,
                <div style={{ height: 20 }}/>
                <div style={{
                    display: 'flex',
                    height: 50,
                    width: '70%',
                }}>
                    <Button text="send recovery link"
                        leftMost rightMost
                        onClick={this.sendRecoveryLink}
                        fontSize="24"
                        fontColor="#eee"
                        background={"linear-gradient(#59f79d, #2c6846)"}
                        backgroundPressed="#a3e2bf"
                        pressed={this.state.loggingIn || this.state.recoverySent}
                        disabled={!this.state.login || !LoginDialog.validEmail(this.state.login)}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    marginTop: 20,
                    alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                    'width': 50, 'height': 50,
                }}>
                    <div className={
                        `tux-loading-indicator ${this.state.loggingIn?'show':''}`
                    }>
                    </div>
                </div>
                { this.state.loginMessage &&  <div style={{
                    fontFamily,
                    fontSize: 20,
                    padding: 20,
                }}>
                    { this.state.loginMessage }
                </div>
                }
                <div style={{
                    display: 'flex',
                    height: 50,
                    width: '70%',
                }}>
                { this.state.recoverySent &&
                    <Button text="close"
                        leftMost rightMost
                        onClick={this.props.onClickOut}
                        fontSize="24"
                        fontColor="#eee"
                        background={"linear-gradient(#59f79d, #2c6846)"}
                        backgroundPressed="#a3e2bf"
                    />
                }
                </div>

            </div>
        </div>);
    }

    static validEmail(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    signupSection() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return (this.state.signupMessage ?
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    fontFamily,
                    fontSize: 20,
                    padding: 20,
                }}>
                    { this.state.signupMessage }
                </div>
                <div style={{
                    display: 'flex',
                    height: 50,
                    width: '70%',
                }}>
                    <Button text="close"
                        leftMost rightMost
                        onClick={this.props.onClickOut}
                        fontSize="24"
                        fontColor="#eee"
                        background={"linear-gradient(#59f79d, #2c6846)"}
                        backgroundPressed="#a3e2bf"
                    />
                </div>
            </div> :
            <div style={{
                width: '100%',
                height: 'auto',
                borderBottomLeftRadius: borderRadius,
                borderBottomRightRadius: borderRadius,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <div className="loginsection">
                <div style={{ height: 20 }}/>
                <input
                    ref={(input) => { this.usernameInput = input; input && input.focus(); }}
                    placeholder="Enter a username"
                    className="input"
                    onChange={this.usernameChange.bind(this)}
                    onBlur={() => { this.setState((prevState) => {
                        this.checkUsernameAvailable(prevState.username);
                        return { usernameConfirmed: prevState.username }});
                    }}
                    disabled={this.state.loggingIn}
                    value={this.state.username}
                    onKeyPress={(event) => {
                        if(event.key === 'Enter'){
                            this.refs.email.focus();
                        }
                    }}
                    style={{
                        height: 40,
                        width: '100%',
                        display: this.state.usernameConfirmed ? 'none' : '',
                    }}/>
                <div
                    className="confirmed-input"
                    style={{
                        display: this.state.usernameConfirmed ? '' : 'none',
                    }}
                     onClick={() => {
                         this.setState({ usernameConfirmed: false }, () => {
                             this.usernameInput.focus();
                         });
                     }}
                ><div><b>Username:</b> { this.state.username }</div></div>
                <div style={{ height: 20 }}/>
                <input ref="email" type="email"
                    placeholder="Enter an email"
                    className="input"
                    onChange={this.emailChange.bind(this)}
                    onBlur={() => {this.setState((prevState) => {
                        this.checkUsernameAvailable(prevState.email);
                        return { emailConfirmed:
                            this.constructor.validEmail(prevState.email) ? prevState.email : null
                        }});
                    }}
                    disabled={this.state.loggingIn}
                    value={this.state.email}
                       onKeyPress={(event) => {
                           if(event.key === 'Enter'){
                               this.refs.password_field.focus();
                           }
                       }}
                    style={{
                        height: 40,
                        width: '100%',
                        display: this.state.emailConfirmed ? 'none' : '',
                    }}/>
                <div
                    className="confirmed-input"
                    style={{
                        display: this.state.emailConfirmed ? '' : 'none',
                    }}
                     onClick={() => {
                         this.setState({ emailConfirmed: false }, () => {
                             this.usernameInput.focus();
                         });
                     }}
                ><div><b>Email:</b> { this.state.email }</div></div>
                <div style={{ height: 20 }}/>
                <input ref="password_field" type="password"
                    placeholder="Enter a password"
                    className="input"
                    onChange={this.passwordChange.bind(this)}
                    onBlur={() => { this.setState({ passwordConfirmed: true }); }}
                    onFocus={() => { this.setState({ passwordConfirmed: false }); }}
                    disabled={this.state.loggingIn}
                    value={this.state.password}
                    onKeyPress={(event) => {
                       if(event.key === 'Enter'){
                           this.refs.password_field2.focus();
                       }
                    }}
                    style={{
                        height: 40,
                        width: '100%',
                        color: this.state.passwordConfirmed && this.state.password !== this.state.password2 ?
                           'red' : 'black'
                    }}/>
                <div style={{ height: 20 }}/>
                <input ref="password_field2" type="password"
                       placeholder="Retype password"
                       className="input"
                       onChange={this.password2Change.bind(this)}
                       disabled={this.state.loggingIn}
                       value={this.state.password2}
                       onKeyPress={(event) => {
                           if(event.key === 'Enter'){
                               this.signUp();
                           }
                       }}
                       style={{
                           height: 40,
                           width: '100%',
                       }}/>
                {!this.state.loggingIn && [
                    <div style={{ height: 20 }}/>,
                    <div style={{
                        display: 'flex',
                        height: 50,
                        width: '70%',
                    }}>
                        <Button
                            text="sign up"
                            leftMost rightMost
                            onClick={this.signUp}
                            fontSize="24"
                            fontColor="#eee"
                            background={"linear-gradient(#59f79d, #2c6846)"}
                            backgroundPressed="#a3e2bf"
                            pressed={this.state.loggingIn}
                            disabled={this.constructor.invalidForm(this.state)}
                        >
                            <i right/>
                        </Button>
                    </div>
                ]}
                <div style={{
                    color: '#D00',
                    marginTop: 15,
                }}>{this.getWarning()}</div>
                <div style={{
                    display: 'flex',
                    marginTop: 20,
                    alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                    'width': 50, 'height': 50,
                }}>
                    <div className={
                        `tux-loading-indicator ${this.state.loggingIn?'show':''}`
                    }>
                    </div>
                </div>
            </div>
        </div>);
    }

    static shouldShowOverlay(mode) {
        if (!mode) {
            return false;
        }
        switch(mode) {
            case 'games':
            case 'projects':
                return false;
        }
        return true;
    }
    
    render() {
        const visible = LoginDialog.shouldShowOverlay(this.props.mode);
        return (
            <div>
                <Overlay visible={visible}>
                { visible &&
                    <div className="overlay">
                        <div style={{
                            position: 'fixed',
                            top: 0, left: 0,
                            width: '100%', height: 'calc(100% + 200px)',
                            transition: 'opacity .2s linear',
                            opacity: visible ? .8: 0,
                            backgroundColor: '#002',
                            cursor: 'pointer',
                            display: visible ? '' : 'none',
                        }} onClick={this.props.onClickOut}>
                        </div>
                        <div className="popdialog">
                            <LoginDialogHeader toggle={this.props.toggle} mode={this.props.mode}/>
                            <div style={{ width: '100%', overflow: 'hidden' }}>
                                { this.props.mode==='login' && this.loginSection() }
                                { this.props.mode==='reset-password' && this.loginSection() }
                                { this.props.mode==='signup' && this.signupSection() }
                                { this.props.mode==='recover' && this.recoverSection() }
                            </div>
                        </div>
                    </div>
                }
                </Overlay>
            </div>
        );
    }
}

class PopDialog extends React.Component {
    render() {

    }
}

class Button extends React.Component {
    render() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return (!this.props.hidden && <div style={{
            margin: this.props.space ? "0 5px" : null,
            flex: 1,
            transition: '.2s',
            background: this.props.pressed
                ? this.props.backgroundPressed || '#444466'
                : this.props.disabled
                ? 'linear-gradient(white, silver)'
                : this.props.background || 'linear-gradient(white, gray)',
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
            pointerEvents: this.props.pressed ? 'none' : '',
        }} onClick={this.props.disabled?null:this.props.onClick}>
            <div style={{
                fontSize: this.props.fontSize || 20,
                color: this.props.pressed ? 'snow'
                    : this.props.disabled ? 'silver'
                    : this.props.fontColor || '#666677',
            }}>
                {this.props.text}
            </div>
        </div>);
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
        const buttons = this.props.list.map((property, index, array) => {
            const prop = typeof(property)==='string' ? { text:property } : property;
            return (
                <Button
                    pressed={this.props.pressed===index}
                    onClick={prop.onClick ? prop.onClick : () => { this.onClick(index); }}
                    text={prop.text}
                    leftMost={index===0}
                    rightMost={index===array.length-1}
                />
            )
        });
        return (<div style={{
            display: 'flex',
            height: 50,
            width: 'calc(100% - 100px)',
        }}>
            { buttons }
        </div>);
    }
}

class LoginDialogHeader extends React.Component {
    render() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return <div style={{
            width: '100%',
            height: 100,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            background: 'linear-gradient(white, silver)',
            borderBottom: '1px solid gray',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {this.props.mode === 'recover' ? <div style={{
                fontFamily,
                padding: 50,
            }}>
                Please enter your email. We will send you a link to reset your password.
            </div>:
            <ButtonBar list={[ 'login', 'signup' ]} onClick={this.props.toggle}
               pressed={this.props.mode==='login' || this.props.mode==='reset-password' ? 0 : 1}
            />}
        </div>
    }
}

class MenuSwitcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: session.user,
            path: location.pathname,
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.onModeChange = this.onModeChange.bind(this);
        this.canUpdateHistory = true;
        this.onUrlChange = this.onUrlChange.bind(this);
    }

    handleLogin() {
        this.setState({
            username: session.user,
        });
    }

    onModeChange(mode) {
        this.setState({
            path: `/${mode || ''}`,
        });
    }

    onUrlChange() {
        if (location.pathname !== this.state.path) {
            this.canUpdateHistory = false;
            this.setState({
                path: location.pathname,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.path !== this.state.path) {
            if (!this.canUpdateHistory) {
                this.canUpdateHistory = true;
            } else {
                const mode = this.state.path.substr(1);
                history.pushState({mode}, mode || 'Dobuki', this.state.path);
            }
        }
    }

    componentDidMount() {
        window.addEventListener('popstate', this.onUrlChange);
    }

    componentDidUnmount() {
        window.removeEventListener('popstate', this.onUrlChange);
    }

    render() {
        return this.state.username
            ? <ProfileMenu url={this.state.path}
                username={this.state.username}
                onLogout={this.handleLogin}
                onModeChange={this.onModeChange}
            />
            : <LoginMenu url={this.state.path}
                onLogin={this.handleLogin}
                onModeChange={this.onModeChange}
            />
        ;
    }
}

class LoginMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: this.props.url.substr(1),
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
        this.recover = this.recover.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    open(mode) {
        this.setState({
            mode: mode,
        });
    }

    close() {
        this.setState((prevState) => ({
            mode: null,
        }));
        this.refs.loginDialog.clear();
    }

    onLogin() {
        this.close();
        this.props.onLogin();
    }

    toggle() {
        this.setState((prevState, props) => ({
            mode: prevState.mode === 'signup' ? 'login' : 'signup',
        }));
    }

    recover(callback) {
        this.setState({
            mode: 'recover',
        }, callback);
    }

    resetPassword(callback) {
        this.setState({
            mode: 'reset-password',
        }, callback);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.mode !== this.state.mode) {
            this.props.onModeChange(this.state.mode);
        }
        if (prevProps.url !== this.props.url) {
            this.setState({
                mode: this.props.url.substr(1),
            });
        }
    }

    render() {
        const fontFamily = "'Concert One', cursive";
        return (
            <div>
                <div style={{
                    position: 'fixed',
                    top: 0, right: 10,
                    margin: '0 8px',
                    display: 'flex',
                    flexDirection: 'row',
                    zIndex: 3,
                }}>
                    <div className="button" onClick={() => this.open('login')} style={{
                        width: 50, height: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <div style={{ fontFamily }}>login</div>
                        <img style={{ width: 32, height: 32 }} src="/assets/login.svg" />
                    </div>
                    <div className="button" onClick={() => this.open('signup')} style={{
                        width: 50, height: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <div style={{ fontFamily }}>signup</div>
                        <img style={{ width: 28, height: 28 }} src="/assets/signup.svg" />
                    </div>
                </div>
                <LoginDialog ref="loginDialog"
                    mode={this.state.mode}
                    onClickOut={this.close}
                    toggle={this.toggle}
                    recover={this.recover}
                    onLogin={this.onLogin}
                    resetPassword={this.resetPassword}
                />
            </div>
        );
    }
}

class ProfileMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: false,
            mode: this.props.url.substr(1),
            updateTime: session.refresh,
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.logout = this.logout.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.profilePicUpdated = this.profilePicUpdated.bind(this);
        LoginMenu.canUpdateHistory = true;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        let node = event.target;
        while(node) {
            if(node===this.refs.wrapper) {
                return;
            }
            node = node.parentNode;
        }
        this.close();
    }

    profile_pic() {
        return this.state.updateTime
            ? `/profile-picture/${this.props.username}/thumbnail.png?${this.state.updateTime}`
            : `/profile-picture/${this.props.username}/thumbnail.png`;
    }

    profilePicUpdated() {
        this.setState({
            updateTime: Date.now(),
        });
    }

    open() {
        this.setState((prevState) => ({
            view: !prevState.view,
        }));
    }

    close() {
        this.setState((prevState) => ({
            view: false,
        }));
        this.refs.profileDialog.clear();
    }

    logout() {
        this.close();
        api.logout((result) => {
            session.user = null;
            this.props.onLogout();
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.mode !== this.state.mode) {
            this.props.onModeChange(this.state.mode);
        }
        if (prevProps.url !== this.props.url) {
            this.setState({
                mode: this.props.url.substr(1),
            });
        }
    }

    editProfile() {
        this.setState({
            mode: 'profile',
            view: false,
        });
    }

    render() {
        const fontFamily = "'Concert One', cursive";
        return (
            <div ref="wrapper">
                <div className="button" onClick={this.open} style={{
                    position: 'fixed',
                    top: 0, right: 10,
                    padding: '0 8px',
                    height: 50,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                }}>
                    <div style={{
                        fontFamily,
                        fontSize: 16,
                    }}>
                        { this.props.username }
                    </div>
                    <img style={{
                        width: 40, height: 40, margin: '0 0 0 8px',
                        borderRadius: 3,
                    }} src={ this.profile_pic() } />
                </div>
                { this.state.view &&
                    <div style={{
                        position: 'fixed',
                        backgroundColor: '#555',
                        minWidth: 150,
                        right: 0,
                        zIndex: 2,
                    }}>
                        <div className="menu" onMouseDown={this.editProfile}>
                            <div>Edit profile</div>
                        </div>
                        <div className="menu" onMouseDown={this.logout}>
                            <div>Log out</div>
                        </div>
                    </div>
                }
                <ProfileDialog ref="profileDialog"
                    mode={this.state.mode}
                    username={this.props.username}
                    onClickOut={() => {
                        this.setState({ mode: null });
                    }}
                    profilePicUpdated={this.profilePicUpdated}
                    updateTime={this.state.updateTime}
                />
            </div>
        );
    }
}

class Tip extends React.Component {
    render() {
        const fontFamily = "'Concert One', cursive";
        return (<div style={{
            position: 'fixed',
            width: '100%',
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: 2,
        }}>
            <div className="statetip" style={{
                fontFamily,
                marginTop: this.props.showTip ? 0 : -100,
                opacity: this.props.showTip ? .95 : 0,
            }}>
                {this.props.tip}
            </div>
        </div>);
    }
}

class ProfileDialog extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            cursorOnProfile: 'pointer',
            profileX: 0,
            profileY: 0,
            image: null,
            saving: false,
            password: null,
            password2: null,
            old_password: null,
            canChangePassword: false,
            canSave: false,
        };
        this.state = {};
        for (let k in this.initialState) {
            this.state[k] = this.initialState[k];
        }
        this.state.canChangePassword = this.props.mode==='reset-password';

        this.image = new Image();
        this.image.addEventListener('load', this.onImageLoaded.bind(this));

        this.profileSection = this.profileSection.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.onFileRead = this.onFileRead.bind(this);
        this.onTouchProfile = this.onTouchProfile.bind(this);
        this.onClickProfile = this.onClickProfile.bind(this);
        this.onMoveProfile = this.onMoveProfile.bind(this);
        this.onSave = this.onSave.bind(this);
        this.profile_pic = this.profile_pic.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.password2Change = this.password2Change.bind(this);
        this.oldPasswordChange = this.oldPasswordChange.bind(this);
        this.lastMousePoint = { x: 0, y: 0 };
        this.canUpload = false;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.mode !== this.state.mode) {
            this.image = new Image();
            this.image.addEventListener('load', this.onImageLoaded.bind(this));
            this.setState({
                image: null,
                canChangePassword: false,
                saving: false,
                canSave: false,
                password: null,
                password2: null,
                old_password: null,
            });
        }
    }

    onImageLoaded(e) {
        const image = e.target;
        const minSize = Math.min(image.naturalWidth, image.naturalHeight);
        const scale = 120 / minSize;
        this.setState({
            image: image.src,
            profileX: -(image.naturalWidth * scale - 120) / 2,
            profileY: -(image.naturalHeight * scale - 120) / 2,
            canSave: true,
            imageTooSmall: minSize < 240,
        });
    }

    onFileUpload(e) {
        const uploader = e.target;
        if (uploader.files && uploader.files[0]) {
            const reader = new FileReader();
            reader.addEventListener('load', this.onFileRead);
            reader.readAsDataURL(uploader.files[0]);
        }
    }

    onFileRead(e) {
        const reader = e.target;
        this.image.src = reader.result;
    }

    clear() {
        this.setState(this.initialState);
    }

    onClickProfile() {
        if (this.canUpload) {
            this.setState({
                cursorOnProfile: 'pointer',
            });
            this.refs.fileupload.click();
        }
    }

    onTouchProfile(e) {
        this.canUpload = true;
        this.lastMousePoint.x = e.clientX;
        this.lastMousePoint.y = e.clientY;
        if (this.image.naturalWidth !== this.image.naturalHeight) {
            this.setState({
                cursorOnProfile: this.image.naturalWidth > this.image.naturalHeight ? 'ew-resize' : 'ns-resize',
            });
        }
    }

    onMoveProfile(e) {
        if(e.buttons && this.image.naturalWidth !== this.image.naturalHeight) {
            const movementX = this.lastMousePoint.x - e.clientX;
            const movementY = this.lastMousePoint.y - e.clientY;
            if (movementX || movementY) {
                this.canUpload = false;
                this.setState((prevState) => {
                    const scale = 240 / Math.min(this.image.naturalWidth, this.image.naturalHeight);
                    const profileX = Math.min(0, Math.max(
                        -(this.image.naturalWidth * scale / 2 - 120),
                        prevState.profileX - movementX
                    ));
                    const profileY = Math.min(0, Math.max(
                        -(this.image.naturalHeight * scale / 2 - 120),
                        prevState.profileY - movementY
                    ));

                    return {
                        profileX, profileY,
                    };
                });
                this.lastMousePoint.x = e.clientX;
                this.lastMousePoint.y = e.clientY;
            }
            e.stopPropagation();
        }
    }
    
    profilePicBinary() {
        const canvas = document.createElement('canvas');
        canvas.width = 240; canvas.height = 240;
        const ctx = canvas.getContext('2d');
        const minSize = Math.min(this.image.naturalWidth, this.image.naturalHeight);
        const scale = minSize / 120;
        ctx.drawImage(this.image,
            -this.state.profileX * scale, -this.state.profileY * scale, minSize, minSize,
            0, 0, 240, 240
        );
        return canvas.toDataURL("image/png");
    }

    onSave() {
        if (!this.state.loggingIn) {
            this.setState({
                saving: true,
            }, () => {
                api.save(this.props.username,
                        this.state.image ? this.profilePicBinary() : null,
                        this.state.password,
                        this.state.old_password,
                        (result) => {
                    if(result.success) {
                        this.props.profilePicUpdated();
                        this.props.onClickOut();
                    } else {
                        this.setState({
                            saving: false,
                        });
                    }
                });
            });
        }
    }

    passwordChange(e) {
        const target = e.target;
        this.setState((prevState) => {
            const invalid = !LoginDialog.validPassword(target.value);
            const warningMessage = "Your password must have at least eight characters, including one letter and one number.";
            const warning = invalid
                ? warningMessage
                : prevState.warning && warningMessage !== prevState.warning
                ? prevState.warning
                : null;
            return {
                warning,
                password: target.value,
                canSave: true,
            };
        });
    }

    password2Change(e) {
        const target = e.target;
        this.setState((prevState) => {
            const invalid = prevState.password !== target.value;
            const warningMessage = "The passwords you entered must match.";
            const warning = invalid
                ? warningMessage
                : prevState.warning && warningMessage !== prevState.warning
                ? prevState.warning
                : null;
            return {
                warning,
                password2: target.value,
                canSave: true,
            };
        });
    }

    oldPasswordChange(e) {
        const target = e.target;
        this.setState({
            old_password: target.value,
        });
    }

    profile_pic() {
        return this.state.image
            ? this.state.image
            : this.props.updateTime
            ? `/profile-picture/${this.props.username}/image.png?${this.props.updateTime}`
            : `/profile-picture/${this.props.username}/image.png`;
    }

    profileSection() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return (<div style={{
            width: '100%',
            height: 'auto',
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className="loginsection">
                <div style={{ height: 50 }}/>
                <div ref="profile_pic" className="profile-pic"
                 style={{
                    cursor: this.state.cursorOnProfile,
                    backgroundImage: `url(${this.profile_pic()})`,
                    backgroundPositionX: this.state.profileX,
                    backgroundPositionY: this.state.profileY,
                 }}
                 draggable="false"
                 onMouseMove={this.onMoveProfile}
                 onMouseDown={this.onTouchProfile}
                 onClick={this.onClickProfile}>
                    <img style={{
                        marginLeft: 100,
                        position: 'absolute', width: 20, height: 20, zIndex: 1,
                    }} src="/assets/edit.svg" />
                </div>
                {this.state.imageTooSmall &&
                <div style={{height: 10, margin: 5,
                    color: '#D00', fontSize: 12}}>
                    For best result, your image should be at least 240x240
                </div>
                }
                <div style={{
                    width: 0, height: 0,
                    overflow: 'hidden',
                }}>
                    <input ref="fileupload" onChange={this.onFileUpload} type="file" accept="image/*" />
                </div>
                <div style={{
                    fontFamily,
                    fontSize: 20,
                }}>{this.props.username}</div>

                {!this.state.canChangePassword ? <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: 40,
                        width: 160,
                        marginTop: 20,
                    }}>
                        <Button
                            text="Change password"
                            leftMost rightMost
                            fontSize="18"
                            fontColor="#eee"
                            background={"linear-gradient(#59f79d, #2c6846)"}
                            backgroundPressed="#a3e2bf"
                            space="true"
                            onClick={() => {
                                this.setState({
                                    canChangePassword: true,
                                });
                            }}
                        />
                    </div> :
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '70%',
                        marginTop: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        { this.resetPasswordBox() }
                    </div>
                }

                <div style={{
                    display: 'flex',
                    marginTop: 20,
                    alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                    width: 50, height: 50,
                }}>
                    <div className={
                        `tux-loading-indicator ${this.state.saving?'show':''}`
                    }>
                    </div>
                </div>
                <hr/>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: 50,
                    width: '70%',
                    margin: '20px 0',
                }}>
                    <Button
                        text="Save"
                        leftMost rightMost
                        fontSize="24"
                        fontColor="#eee"
                        background={"linear-gradient(#59f79d, #2c6846)"}
                        backgroundPressed="#a3e2bf"
                        space="true"
                        onClick={this.onSave}
                        disabled={!this.state.canSave}
                    />
                    <Button
                        text="Cancel"
                        leftMost rightMost
                        fontSize="24"
                        fontColor="#eee"
                        background={"linear-gradient(#f7599d, #682c46)"}
                        backgroundPressed="#e2bfa3"
                        space="true"
                        onClick={this.props.onClickOut}
                    />
                </div>
            </div>
        </div>);
    }

    resetPasswordBox() {
        const fontFamily = "'Concert One', cursive";
        return [
            <div style={{ fontFamily, marginBottom: 5 }}>Old password</div>,
            <input ref="old_password_field"
                   type="password"
                   placeholder="Enter your old password"
                   className="input"
                   onChange={this.oldPasswordChange.bind(this)}
                   value={this.state.old_password}
                   onKeyPress={(event) => {
                       if(event.key === 'Enter'){
                           this.refs.password_field.focus();
                       }
                   }}
                   style={{
                       height: 40,
                       width: '100%',
                   }}/>,
            <div style={{ height: 20 }}/>,
            <div style={{ fontFamily, marginBottom: 5 }}>New password</div>,
            <input ref="password_field"
                   type="password"
                   placeholder="Enter a new password"
                   className="input"
                   onChange={this.passwordChange.bind(this)}
                   disabled={this.state.loggingIn}
                   value={this.state.password}
                   onKeyPress={(event) => {
                       if(event.key === 'Enter'){
                           this.refs.password_field2.focus();
                       }
                   }}
                   style={{
                       height: 40,
                       width: '100%',
                   }}/>,
            <div style={{ height: 10 }}/>,
            <input ref="password_field2"
                   type="password"
                   placeholder="Re-enter the same password"
                   className="input"
                   onChange={this.password2Change.bind(this)}
                   disabled={this.state.loggingIn}
                   value={this.state.password2}
                   onKeyPress={(event) => {
                       if (event.key === 'Enter') {
                           event.target.blur();
                       }
                   }}
                   style={{
                       height: 40,
                       width: '100%',
                   }}/>,
            <div style={{ height: 20 }}/>,
            <div style={{
                color: '#D00',
                marginTop: 15,
            }}>{this.state.warning}</div>,
        ];
    }

    render() {
        const visible = LoginDialog.shouldShowOverlay(this.props.mode);
        return (
            <div>
                <Overlay visible={visible}>
                    { visible &&
                    <div className="overlay">
                        <div style={{
                            position: 'fixed',
                            top: 0, left: 0,
                            width: '100%', height: 'calc(100% + 200px)',
                            transition: 'opacity .2s linear',
                            opacity: this.props.mode ? .8: 0,
                            backgroundColor: '#046',
                            cursor: 'pointer',
                            display: this.props.mode ? '' : 'none',
                        }} onClick={this.props.onClickOut}>
                        </div>
                        <div className="popdialog" style={{
                            width: 600, height: 'auto',
                        }}>
                            <div style={{ width: '100%', overflow: 'hidden' }}>
                                { this.profileSection() }
                            </div>
                        </div>
                    </div>
                    }
                </Overlay>
            </div>
        );
    }
}