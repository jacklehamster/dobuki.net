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
        setTimeout(this.hideTip, 6000);
    }

    render() {
        const fontFamily = "'Concert One', cursive";
        return (<div style={{
            backgroundColor: '#F0FCFF',
        }}>
            <HeaderTitle ref="header" title="Dobuki.net" icon="/assets/dobuki.png" />
            { this.state.tip &&
                <Tip showTip={this.state.showTip} tip={this.state.tip} />
            }
            <MenuSwitcher />
            <div className="banner">
                <div style={{
                    flex: 1,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: 'url("/assets/banner.jpg")',
                }}>
                </div>
            </div>

            <div style={{
                padding: '20px 100px',
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                flexWrap: 'wrap',
            }}>
                <iframe frameBorder="0" style={{
                        marginBottom: 20,
                    }}
                    src="https://itch.io/embed/198002?bg_color=cefafd&amp;fg_color=222222&amp;link_color=186ae7&amp;border_color=bebebe"
                    width="800" height="167" />

                <iframe frameBorder="0"
                    src="https://itch.io/embed/18395?bg_color=000000&amp;fg_color=9899ae&amp;link_color=5c5ffa&amp;border_color=333333"
                    width="280" height="167" />
                <iframe frameBorder="0"
                    src="https://itch.io/embed/170227?bg_color=ecefe6&amp;fg_color=222222&amp;link_color=b0cc2e&amp;border_color=c0ca9f"
                    width="280" height="167" />
                <iframe frameBorder="0"
                    src="https://itch.io/embed/170228?bg_color=e1daf6&amp;fg_color=222222&amp;link_color=d2d079&amp;border_color=a589c1"
                    width="280" height="167" />
                <iframe frameBorder="0"
                    src="https://itch.io/embed/116068?bg_color=edf7f8&amp;fg_color=222222&amp;link_color=5c99fa&amp;border_color=c1c5c5"
                    width="280" height="167" />
                <iframe frameBorder="0"
                    src="https://itch.io/embed/136767?bg_color=e79797&amp;fg_color=222222&amp;link_color=f0b214&amp;border_color=ff2525"
                    width="280" height="167" />
                <iframe frameBorder="0"
                    src="https://itch.io/embed/122302?bg_color=eeffff&amp;fg_color=222222&amp;link_color=49a2ac&amp;border_color=bebebe"
                    width="280" height="167" />
            </div>

            <div style={{
                display: 'flex',
                fontFamily,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                verticalAlign: 'middle',
            }}>
                <h2>More games <a target="_blank" href="https://dobuki.weebly.com/">here</a></h2>
            </div>
            <div style={{
                width: '100%',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                top: -193,
            }}>
                <img style={{
                    height: 245,
                }} src="/assets/upsidedown-penguin.png"/>
            </div>
        </div>);
    }
}