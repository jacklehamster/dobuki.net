const TABS = [
    null,
    {
        id: 'games',
        label: 'Games',
    },
    {
        id: 'projects',
        label: 'Projects',
    },
];

class Homepage extends Page {
    constructor(props) {
        super(props);

        this.state = {
            tip: null,
            showTip: false,
            selectedTab: Homepage.getSelectedTab(),
        };

        this.hideTip = this.hideTip.bind(this);
    }

    static getSelectedTab() {
        for(let i=1; i<TABS.length; i++) {
            if(location.pathname===`/${TABS[i].id}`) {
                return i;
            }
        }
        return 0;
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

    shouldShowTab(id) {
        return TABS[this.state.selectedTab||1].id === id;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedTab !== this.state.selectedTab) {
            const tab = TABS[this.state.selectedTab||1];
            history.pushState({tab:tab.id}, tab.label, `/${tab.id}`);
        }
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
                display: 'flex',
                justifyContent: 'center',
                marginTop: 50,
                backgroundColor: "#ffeccc",
            }}>
                <div style={{
                    flexDirection: 'row',
                    display: 'flex',
                    width: 750,
                    maxWidth: '90vw',
                    fontFamily,
                    borderRadius: 5,
                }}>
                    {
                        TABS.map((tab, index) => {
                            if(index) {
                                const selected = (this.state.selectedTab||1)===index;
                                const classes = `tab ${selected?'selected':''}`;
                                return <div onClick={e => this.setState({ selectedTab: index })} className={classes}>{tab.label}</div>;
                            } else {
                                return;
                            }
                        })
                    }
                </div>
            </div>

            <div style={{
                padding: '5px 50px',
                display: this.shouldShowTab('projects') ? 'flex' : 'none',
                justifyContent: 'center',
                textAlign: 'center',
                flexDirection: 'column',
                fontFamily,
            }}>
                <div className="paragraph">
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "end",
                    }}>
                        <div style={{ marginRight: 10 }}>
                            <div><a href="/sudoku">Sudoku Solver</a></div>
                            <div className="summary">
                                Sudoku Solver is able to solve any Sudoku Puzzle. In fact, every refresh you
                                see is a new Sudoku Puzzle solved by the algorithm. The solver uses WebAssembly
                                and WebWorkers to run smoothly and efficiently. Note that the algorithm itself
                                is not perfect at solving Sudoku puzzle, but it is successful at it nearly 100%
                                of the time because of retries hundreds of times per second.
                            </div>
                        </div>
                        <iframe frameBorder="0" width="80" height="80" src="/sudoku"/>
                    </div>
                </div>

                <div className="paragraph">
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "end",
                    }}>
                        <div style={{ marginRight: 10 }}>
                            <div><a href="/webgl/animation">WebGL Sprite Animator</a></div>
                            <div className="summary">This project is a work in progress for a tool that will facilitate transfer
                                of animated Flash movieclips to javascript. The first step is splitting the
                                animation into pngs, and spilling out a JSON file containing all the details
                                for reproducing the animation. Then the files get combined into one single
                                SpriteSheet. The display goes through WebGL, because this project is mainly for
                                gaming, so we want the best performing graphics technology on the Web.
                            </div>
                        </div>
                        <iframe frameBorder="0" width="80" height="100" src="/webgl/animation"/>
                    </div>
                </div>

                <div className="paragraph">
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "right",
                    }}>
                        <div style={{ marginRight: 10 }}>
                            <div><a href="/click-and-point-editor">Click and Point Editor</a></div>
                            <div className="summary">A collaboration with <a href="https://www.linkedin.com/in/leobenkel/">
                                Leo Benkel</a>. The goal is to
                                devise an easy way to make point and click games. The version shown here is a
                                bit behind the one on the <a href="https://github.com/The-Brains/ClickAndPointLib">
                                    official repo</a>, but it showcases an GUI editor for editing the game as you
                                play it, which I believe is the most friendly way to build a point and click game.
                            </div>
                        </div>
                        <div style={{
                            minWidth: 80, minHeight: 80,
                            backgroundSize: "80px 49px",
                            backgroundImage: "url(assets/click-and-point-thumbnail.png)",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                        }}>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                padding: '5px 50px',
                display: this.shouldShowTab('games') ? 'flex' : 'none',
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
                    src="https://itch.io/embed/223676?bg_color=000000&amp;fg_color=c2c2c2&amp;link_color=afa309&amp;border_color=333333"
                    width="288" height="167" />
                <iframe frameBorder="0"
                    src="https://itch.io/embed/218761?bg_color=fcfcf2&amp;fg_color=222222&amp;link_color=fa5c5c&amp;border_color=cab6b6"
                    width="288" height="167" />
                <iframe frameBorder="0"
                    src="https://itch.io/embed/18395?bg_color=000000&amp;fg_color=9899ae&amp;link_color=5c5ffa&amp;border_color=333333"
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
                display: this.shouldShowTab('games') ? 'flex' : 'none',
                fontFamily,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                verticalAlign: 'middle',
            }}>
                <h2>More games <a target="_blank" href="https://dobuki.weebly.com/">here</a></h2>
            </div>

            <div style={{
                display: this.shouldShowTab('projects') ? 'flex' : 'none',
                fontFamily,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                verticalAlign: 'middle',
            }}>
                <h2>More projects <a target="_blank" href="https://github.com/jacklehamster?tab=repositories">here</a></h2>
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
            <div style={{textAlign: 'right', fontSize: 10}}>
                Site by <a rel="author" href="https://plus.google.com/u/4/107340140805357940387">
                Jack Le Hamster</a>
            </div>
        </div>);
    }
}