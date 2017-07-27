class Page extends React.Component {
    static render() {
        ReactDOM.render(React.createElement(this, null), document.getElementById('root'));
    }
}

class HeaderTitle extends React.Component {
    reloadPage() {
        location.replace('');
    }

    render() {
        const divStyle = {
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
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
            <div style={divStyle}>
                <img style={imgStyle} src={this.props.icon} onClick={this.reloadPage}/>
                <h1 style={h1Style} onClick={this.reloadPage}>{this.props.title}</h1>
            </div>)
                ;
    }
}

class LoginDialog extends React.Component {
    constructor(props) {
        super(props);
        this.onClickOut = props.onClickOut;
        this.toggle = props.toggle;
    }

    render() {
        const borderRadius = 8;
        const fontFamily = "'Concert One', cursive";
        return (
            <div style={{
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
                }} onClick={this.onClickOut}>
                </div>
                { this.props.mode &&
                    <div style={{
                        width: '100vw',
                        height: '100vw',
                        maxHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            width: 500, height: 500,
                            maxWidth: 'calc(100% - 20px)',
                            maxHeight: 'calc(100% - 20px)',
                            borderRadius,
                            backgroundColor: 'snow',
                            zIndex: 1,
                        }}>
                            <div style={{
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
                                <div style={{
                                    display: 'flex',
                                    height: 50,
                                    width: 'calc(100% - 100px)',
                                }}>
                                    <div style={{
                                        flex: 1,
                                        transition: '.2s',
                                        background: this.props.mode==='login'
                                            ? '#444466' : 'linear-gradient(white, gray)',
                                        borderRight: '1px solid gray',
                                        borderTopLeftRadius: borderRadius,
                                        borderBottomLeftRadius: borderRadius,
                                        fontFamily,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        pointerEvents: this.props.mode === 'login' ? 'none' : '',
                                    }} onClick={this.toggle}>
                                        <div style={{
                                            fontSize: 20,
                                            color: this.props.mode==='login' ? 'snow' : '#666677',
                                        }}>
                                            login
                                        </div>
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        transition: '.2s',
                                        background: this.props.mode==='signup'
                                            ? '#444466' : 'linear-gradient(white, gray)',
                                        borderLeft: '1px solid gray',
                                        borderTopRightRadius: borderRadius,
                                        borderBottomRightRadius: borderRadius,
                                        fontFamily,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        pointerEvents: this.props.mode === 'signup' ? 'none' : '',
                                    }} onClick={this.toggle}>
                                        <div style={{
                                            fontSize: 20,
                                            color: this.props.mode==='signup' ? 'snow' : '#666677',
                                        }}>
                                            sign up
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mode: this.constructor.loginState(props.url) };
        this.login = this.login.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
        this.canUpdateHistory = true;
        window.addEventListener('popstate', this.onUrlChange.bind(this));
    }

    static loginState(url) {
        return url==='/login' ?'login'
            :url==='/signup' ?'signup'
            :''
    }

    login(e) {
        this.setState({
            mode: 'login',
        });
    }

    close(e) {
        this.setState({
            mode: null,
        });
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
                <div className="button" onClick={this.login} style={{
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
                <LoginDialog mode={this.state.mode}
                     onClickOut={this.close}
                     toggle={this.toggle}
                />
            </div>
        );
    }
}

class Card extends React.Component {

}