
class Page extends React.Component {
    showTip() {}

    clearQuery() {
        history.replaceState({}, 'Dobuki', location.href.split("?")[0]);
    }

    static render() {
        return ReactDOM.render(React.createElement(this, null), document.getElementById('root'));
    }
}

class HeaderTitle extends React.Component {
    reloadPage() {
        location.replace('');
    }

    render() {
        const divStyle = {
            background: 'linear-gradient(white, silver)',
            borderBottom: '1px solid gray',
            height: 50,
        };

        const h1Style = {
            fontSize: 32,
            fontFamily: "'Fredoka One', cursive",
            margin: 0,
            color: '#012',
            textShadow: '1px 1px 0 #FFF',
            cursor: 'pointer',
        };

        const imgStyle = {
            width: 50,
            height: 50,
            cursor: 'pointer',
        };

        return (
            <div style={divStyle} className="header">
                <img style={imgStyle} src={this.props.icon} onClick={this.reloadPage}/>
                <h1 style={h1Style} onClick={this.reloadPage}>{this.props.title}</h1>
            </div>
        );
    }
}

class Overlay extends React.Component {
    render() {
        return <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            pointerEvents: this.props.mode ? '' : 'none',
        }}>
            <div style={{
                width: '100%',
                height: '100%',
                transition: 'opacity .2s linear',
                opacity: this.props.mode ? .8: 0,
                backgroundColor: '#000022',
                position: 'absolute',
                cursor: 'pointer',
            }} onClick={this.props.onClickOut}>
            </div>
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
        };
        this.state = this.initialState;
        this.loginUsername = this.loginUsername.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    clear() {
        this.setState(this.initialState);
    }

    loginUsername() {
        const self = this;
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
            });
            api.login(this.state.login, null, function(result) {
                if(result.success) {
                    self.props.onClickOut();
                }
            });
        }
    }

    signupSuccess() {
        this.setState({
            signupMessage: `
                Thank you for signing up. Please check ${this.state.email}
                for a confirmation email.
            `,
        });
    }

    signUp() {
        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
            });
            api.signup(
                this.state.username,
                this.state.email,
                this.state.password,
                this.signupSuccess.bind(this),
            );
        }
    }

    loginChange(e) {
        this.setState({
            login: e.target.value,
        });
    }

    usernameChange(e) {
        this.setState({
            username: e.target.value,
        });
    }

    emailChange(e) {
        this.setState({
            email: e.target.value,
        });
    }

    passwordChange(e) {
        this.setState({
            password: e.target.value,
        });
    }

    password2Change(e) {
        this.setState({
            password2: e.target.value,
        });
    }

    invalidForm(state) {
        return !state.username || !state.email || !state.password || state.password2 !== state.password;
    }

    loginSection() {
        const borderRadius = 8;
        return (<div style={{
            width: '100%',
            height: 'auto',
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 'calc(100% - 120px)',
            }}>
                <div style={{ height: 20 }}/>
                <input
                    type="text"
                    placeholder="Enter your username or email"
                    className="input"
                    onChange={this.loginChange.bind(this)}
                    disabled={this.state.loggingIn}
                    value={this.state.login}
                    style={{
                        height: 40,
                        width: '100%',
                    }}/>
                <div style={{ height: 20 }}/>
                <div style={{
                    display: 'flex',
                    height: 50,
                    width: '70%',
                }}>
                    <Button
                        text="login"
                        leftMost rightMost
                        onClick={this.loginUsername}
                        fontSize="24"
                        fontColor="#333"
                        background="linear-gradient(#59f79d, #2c6846)"
                        backgroundPressed="#a3e2bf"
                        pressed={this.state.loggingIn}
                        disabled={!this.state.login}
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
            </div>
        </div>);
    }

    signupSection() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return (this.state.signupMessage ?
            <div style={{
                fontFamily,
                fontSize: 20,
                padding: 20,
            }}>
                { this.state.signupMessage }
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
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 'calc(100% - 120px)',
            }}>
                <div style={{ height: 20 }}/>
                <input
                    ref={(input) => { this.usernameInput = input; }}
                    placeholder="Enter a username"
                    className="input"
                    onChange={this.usernameChange.bind(this)}
                    onBlur={(() => { this.setState((prevState) => { return { usernameConfirmed: prevState.username }}); }).bind(this)}
                    disabled={this.state.loggingIn}
                    value={this.state.username}
                    style={{
                        height: 40,
                        width: '100%',
                        display: this.state.usernameConfirmed ? 'none' : '',
                    }}/>
                <div
                    className="confirmed-input"
                    style={{
                        height: 40,
                        padding: 8,
                        display: this.state.usernameConfirmed ? '' : 'none',
                    }}
                     onClick={(() => { this.setState({ usernameConfirmed: false }); }).bind(this)}
                ><b>Username:</b> { this.state.username }</div>
                <div style={{ height: 20 }}/>
                <input type="email"
                    placeholder="Enter an email"
                    className="input"
                    onChange={this.emailChange.bind(this)}
                    onBlur={(() => { this.setState((prevState) => { return { emailConfirmed: prevState.email }}); }).bind(this)}
                    disabled={this.state.loggingIn}
                    value={this.state.email}
                    style={{
                        height: 40,
                        width: '100%',
                        display: this.state.emailConfirmed ? 'none' : '',
                    }}/>
                <div
                    className="confirmed-input"
                    style={{
                        height: 40,
                        padding: 8,
                        display: this.state.emailConfirmed ? '' : 'none',
                    }}
                     onClick={(() => { this.setState({ emailConfirmed: false }); }).bind(this)}
                ><b>Email:</b> { this.state.email }</div>
                <div style={{ height: 20 }}/>
                <input type="password"
                       placeholder="Enter a password"
                       className="input"
                       onChange={this.passwordChange.bind(this)}
                       onBlur={(() => { this.setState({ passwordConfirmed: true }); }).bind(this)}
                       onFocus={(() => { this.setState({ passwordConfirmed: false }); }).bind(this)}
                       disabled={this.state.loggingIn}
                       value={this.state.password}
                       style={{
                           height: 40,
                           width: '100%',
                           color: this.state.passwordConfirmed && this.state.password !== this.state.password2 ?
                               'red' : 'black'
                       }}/>
                <div style={{ height: 20 }}/>
                <input type="password"
                       placeholder="Retype password"
                       className="input"
                       onChange={this.password2Change.bind(this)}
                       disabled={this.state.loggingIn}
                       value={this.state.password2}
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
                            fontColor="#333"
                            background="linear-gradient(#59f79d, #2c6846)"
                            backgroundPressed="#a3e2bf"
                            pressed={this.state.loggingIn}
                            disabled={this.invalidForm(this.state)}
                        >
                            <i right/>
                        </Button>
                    </div>
                ]}
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

    render() {
        const borderRadius = 8;
        return (
            <Overlay onClickOut={this.props.onClickOut} mode={this.props.mode}>
                { this.props.mode &&
                <div className={'overlay'}>
                    <div className={'popdialog'}>
                        <LoginDialogHeader toggle={this.props.toggle} mode={this.props.mode} />
                        <div style={{ width: '100%', overflow: 'hidden' }}>
                            { this.props.mode==='login' && this.loginSection() }
                            { this.props.mode==='signup' && this.signupSection() }
                        </div>
                    </div>
                </div>
                }
            </Overlay>
        );
    }
}

class Button extends React.Component {
    render() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return (!this.props.hidden && <div style={{
            flex: 1,
            transition: '.2s',
            background:
                this.props.pressed ? this.props.backgroundPressed || '#444466'
                    : this.props.disabled ? 'linear-gradient(white, silver)'
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
        const self = this;
        const buttons = this.props.list.map((property, index, array) => {
            const prop = typeof(property)==='string' ? { text:property } : property;
            return (
                <Button
                    pressed={self.props.pressed===index}
                    onClick={prop.onClick ? prop.onClick : () => { self.onClick(index); }}
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
            <ButtonBar list={[ 'login', 'signup' ]} onClick={this.props.toggle}
               pressed={this.props.mode==='login' ? 0 : 1}
            />
        </div>
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: this.constructor.loginState(props.url),
            initialMode: this.constructor.loginState(props.url) || 'login',
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
        this.canUpdateHistory = true;
        window.addEventListener('popstate', this.onUrlChange.bind(this));
    }

    static loginState(url) {
        return url==='/login' ? 'login'
            :url==='/signup' ? 'signup'
            :''
    }

    open(e) {
        this.setState((prevState) => ({
            mode: prevState.initialMode,
        }));
    }

    close(e) {
        this.setState((prevState) => ({
            initialMode: prevState.mode,
            mode: null,
        }));
        this.refs.loginDialog.clear();
    }

    toggle() {
        this.setState((prevState, props) => ({
            mode: prevState.mode === 'login' ? 'signup' : 'login',
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
                history.pushState({mode: this.state.mode}, this.state.mode || 'Dobuki', `/${this.state.mode || ''}`);
            }
        }
    }

    render() {
        return (
            <div>
                <div className="button" onClick={this.open} style={{
                    position: 'absolute',
                    top: 0, right: 0,
                    margin: '0 8px',
                    width: 50, height: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <div style={{ fontFamily: "'Concert One', cursive" }}>login</div>
                    <img style={{ width: 32, height: 32 }} src="/assets/signin.svg"/>
                </div>
                <LoginDialog ref="loginDialog"
                    mode={this.state.mode}
                    onClickOut={this.close}
                    toggle={this.toggle}
                />
            </div>
        );
    }
}

class Card extends React.Component {

}