class Homepage extends Page {
    constructor(props) {
        super(props);

        this.state = {
            tip: null,
            showTip: false
        };

        this.hideTip = this.hideTip.bind(this);
    }

    hideTip() {
        this.setState({
            showTip: false
        });
    }

    showTip(tip) {
        this.setState({
            showTip: true,
            tip
        });
        setTimeout(this.hideTip, 5000);
    }

    render() {
        const fontFamily = "'Concert One', cursive";
        return React.createElement(
            "div",
            null,
            React.createElement(HeaderTitle, {
                title: "Dobuki.net",
                icon: "/assets/dobuki.png" }),
            React.createElement(Login, { url: location.pathname }),
            React.createElement(
                "div",
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
                    "div",
                    { style: {
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
                            opacity: this.state.showTip ? .9 : 0
                        } },
                    this.state.tip
                )
            ),
            React.createElement(
                "div",
                { style: { margin: 5, height: 300, display: 'flex' } },
                React.createElement("div", { style: {
                        flex: 1, backgroundColor: 'snow',
                        backgroundSize: 'cover',
                        backgroundImage: 'url("https://dobuki.net/wordpress/wp-content/themes/twentyseventeen/assets/images/header.jpg")'
                    } })
            )
        );
    }
}
//# sourceMappingURL=homepage.js.map