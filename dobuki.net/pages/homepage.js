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
                { style: { margin: 0, height: 200, display: 'flex' } },
                React.createElement("div", { style: {
                        flex: 1,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundImage: 'url("/assets/dobukibanner.png")'
                    } })
            ),
            React.createElement("iframe", { frameborder: "0", src: "https://itch.io/embed/170227?bg_color=ecefe6&fg_color=222222&link_color=b0cc2e&border_color=c0ca9f", width: "100%", height: "167" }),
            React.createElement("iframe", { frameborder: "0", src: "https://itch.io/embed/170228?bg_color=e1daf6&fg_color=222222&link_color=d2d079&border_color=a589c1", width: "100%", height: "167" }),
            React.createElement("iframe", { frameborder: "0", src: "https://itch.io/embed/116068?bg_color=edf7f8&fg_color=222222&link_color=5c99fa&border_color=c1c5c5", width: "100%", height: "167" }),
            React.createElement("iframe", { frameborder: "0", src: "https://itch.io/embed/136767?bg_color=ffffff&fg_color=222222&link_color=f0b214&border_color=ff2525", width: "100%", height: "167" }),
            React.createElement("iframe", { frameborder: "0", src: "https://itch.io/embed/122302?bg_color=eeffff&fg_color=222222&link_color=49a2ac&border_color=bebebe", width: "100%", height: "167" }),
            React.createElement(
                "div",
                { style: {
                        display: 'flex',
                        fontFamily,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                    } },
                React.createElement(
                    "h2",
                    null,
                    "More games ",
                    React.createElement(
                        "a",
                        { target: "_blank", href: "http://dobuki.weebly.com/" },
                        "here"
                    )
                )
            )
        );
    }
}
//# sourceMappingURL=homepage.js.map