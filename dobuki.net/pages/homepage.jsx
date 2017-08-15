class Homepage extends Page {
    constructor(props) {
        super(props);

        this.state = {
            tip: null,
            showTip: false,
        };

        this.hideTip = this.hideTip.bind(this);
    }

    hideTip() {
        this.setState({
            showTip: false,
        });
    }

    showTip(tip) {
        this.setState({
            showTip: true,
            tip,
        });
        setTimeout(this.hideTip, 5000);
    }

    render() {
        const fontFamily = "'Concert One', cursive";
        return (<div>
            <HeaderTitle
                title="Dobuki.net"
                icon="/assets/dobuki.png">
            </HeaderTitle>
            <Login url={location.pathname}/>
            <div style={{
                position: 'absolute',
                width: '100%',
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}>
                <div style={{
                    width: 'calc(100vw - 50px)',
                    height: 30,
                    backgroundColor: '#EFA',
                    borderStyle: 'solid',
                    borderColor: '#CD6',
                    color: '#786',
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderBottomWidth: 3,
                    borderTopWidth: 0,
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontFamily,
                    transition: 'margin 1s, opacity 1s',
                    marginTop: this.state.showTip ? 0 : -100,
                    opacity: this.state.showTip ? .9 : 0,
                }}>
                    { this.state.tip }
                </div>
            </div>
            <div style={{ margin: 5, height: 300, display: 'flex' }}>
                <div style={{ flex: 1, backgroundColor: 'snow' }}>
                </div>
            </div>
        </div>);
    }
}