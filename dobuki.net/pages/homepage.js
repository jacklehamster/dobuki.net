const TABS = [null, {
    id: 'games',
    label: 'Games'
}, {
    id: 'videos',
    label: 'Videos'
}, {
    id: 'projects',
    label: 'Projects'
}];

class Homepage extends Page {
    constructor(props) {
        super(props);

        this.state = {
            tip: null,
            showTip: false,
            selectedTab: Homepage.getSelectedTab(),
            videos: []
        };

        this.hideTip = this.hideTip.bind(this);
    }

    static getSelectedTab() {
        for (let i = 1; i < TABS.length; i++) {
            if (location.pathname === `/${TABS[i].id}`) {
                return i;
            }
        }
        return 0;
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
        setTimeout(this.hideTip, 6000);
    }

    shouldShowTab(id) {
        return TABS[this.state.selectedTab || 1].id === id;
    }

    loadYoutube() {
        api.youtube(response => {
            this.setState({
                videos: response
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedTab !== this.state.selectedTab) {
            const tab = TABS[this.state.selectedTab || 1];
            history.pushState({ tab: tab.id }, tab.label, `/${tab.id}`);
        }
    }

    componentDidMount() {
        document.addEventListener("DOMContentLoaded", () => {
            this.loadYoutube();
        });
    }

    openYoutube(id) {
        window.open(`https://www.youtube.com/watch?v=${id}`);
        console.log(id);
    }

    render() {
        const fontFamily = "'Concert One', cursive";
        return React.createElement(
            'div',
            { style: {
                    backgroundColor: '#F0FCFF'
                } },
            React.createElement(HeaderTitle, { ref: 'header', title: 'Dobuki.net', icon: '/assets/dobuki.png' }),
            this.state.tip && React.createElement(Tip, { showTip: this.state.showTip, tip: this.state.tip }),
            React.createElement(MenuSwitcher, null),
            React.createElement(
                'div',
                { className: 'banner' },
                React.createElement('div', { style: {
                        flex: 1,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundImage: 'url("/assets/banner.jpg")'
                    } })
            ),
            React.createElement(
                'div',
                { style: {
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 50,
                        backgroundColor: "#ffeccc"
                    } },
                React.createElement(
                    'div',
                    { style: {
                            flexDirection: 'row',
                            display: 'flex',
                            width: 750,
                            maxWidth: '90vw',
                            fontFamily,
                            borderRadius: 5
                        } },
                    TABS.map((tab, index) => {
                        if (index) {
                            const selected = (this.state.selectedTab || 1) === index;
                            const classes = `tab ${selected ? 'selected' : ''}`;
                            return React.createElement(
                                'div',
                                { onClick: e => this.setState({ selectedTab: index }), className: classes },
                                tab.label
                            );
                        } else {
                            return;
                        }
                    })
                )
            ),
            React.createElement(
                'div',
                { style: {
                        padding: '5px 50px',
                        display: this.shouldShowTab('projects') ? 'flex' : 'none',
                        justifyContent: 'center',
                        textAlign: 'center',
                        flexDirection: 'column',
                        fontFamily
                    } },
                React.createElement(
                    'div',
                    { className: 'paragraph' },
                    React.createElement(
                        'div',
                        { style: {
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "end"
                            } },
                        React.createElement(
                            'div',
                            { style: { marginRight: 10 } },
                            React.createElement(
                                'div',
                                null,
                                React.createElement(
                                    'a',
                                    { href: '/sudoku' },
                                    'Sudoku Solver'
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'summary' },
                                'Sudoku Solver is able to solve any Sudoku Puzzle. In fact, every refresh you see is a new Sudoku Puzzle solved by the algorithm. The solver uses WebAssembly and WebWorkers to run smoothly and efficiently. Note that the algorithm itself is not perfect at solving Sudoku puzzle, but it is successful at it nearly 100% of the time because of retries hundreds of times per second.'
                            )
                        ),
                        React.createElement('iframe', { frameBorder: '0', width: '80', height: '80', src: '/sudoku' })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'paragraph' },
                    React.createElement(
                        'div',
                        { style: {
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "end"
                            } },
                        React.createElement(
                            'div',
                            { style: { marginRight: 10 } },
                            React.createElement(
                                'div',
                                null,
                                React.createElement(
                                    'a',
                                    { href: '/webgl/animation' },
                                    'WebGL Sprite Animator'
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'summary' },
                                'This project is a work in progress for a tool that will facilitate transfer of animated Flash movieclips to javascript. The first step is splitting the animation into pngs, and spilling out a JSON file containing all the details for reproducing the animation. Then the files get combined into one single SpriteSheet. The display goes through WebGL, because this project is mainly for gaming, so we want the best performing graphics technology on the Web.'
                            )
                        ),
                        React.createElement('iframe', { frameBorder: '0', width: '80', height: '100', src: '/webgl/animation' })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'paragraph' },
                    React.createElement(
                        'div',
                        { style: {
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "right"
                            } },
                        React.createElement(
                            'div',
                            { style: { marginRight: 10 } },
                            React.createElement(
                                'div',
                                null,
                                React.createElement(
                                    'a',
                                    { href: '/click-and-point-editor' },
                                    'Click and Point Editor'
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'summary' },
                                'A collaboration with ',
                                React.createElement(
                                    'a',
                                    { href: 'https://www.linkedin.com/in/leobenkel/' },
                                    'Leo Benkel'
                                ),
                                '. The goal is to devise an easy way to make point and click games. The version shown here is a bit behind the one on the ',
                                React.createElement(
                                    'a',
                                    { href: 'https://github.com/The-Brains/ClickAndPointLib' },
                                    'official repo'
                                ),
                                ', but it showcases an GUI editor for editing the game as you play it, which I believe is the most friendly way to build a point and click game.'
                            )
                        ),
                        React.createElement('div', { style: {
                                minWidth: 80, minHeight: 80,
                                backgroundSize: "80px 49px",
                                backgroundImage: "url(assets/click-and-point-thumbnail.png)",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center"
                            } })
                    )
                )
            ),
            React.createElement(
                'div',
                { style: {
                        padding: '5px 50px',
                        display: this.shouldShowTab('games') ? 'flex' : 'none',
                        justifyContent: 'center',
                        textAlign: 'center',
                        flexWrap: 'wrap'
                    } },
                React.createElement('iframe', { frameBorder: '0', style: {
                        marginBottom: 20
                    },
                    src: 'https://itch.io/embed/198002?bg_color=cefafd&fg_color=222222&link_color=186ae7&border_color=bebebe',
                    width: '800', height: '167' }),
                React.createElement('iframe', { frameBorder: '0',
                    src: 'https://itch.io/embed/248275?bg_color=23cd44&fg_color=222222&link_color=d11200&border_color=529365',
                    width: '280', height: '167' }),
                React.createElement('iframe', { frameBorder: '0',
                    src: 'https://itch.io/embed/223676?bg_color=000000&fg_color=c2c2c2&link_color=afa309&border_color=333333',
                    width: '280', height: '167' }),
                React.createElement('iframe', { frameBorder: '0',
                    src: 'https://itch.io/embed/218761?bg_color=fcfcf2&fg_color=222222&link_color=fa5c5c&border_color=cab6b6',
                    width: '280', height: '167' }),
                React.createElement('iframe', { frameBorder: '0',
                    src: 'https://itch.io/embed/18395?bg_color=000000&fg_color=9899ae&link_color=5c5ffa&border_color=333333',
                    width: '280', height: '167' }),
                React.createElement('iframe', { frameBorder: '0',
                    src: 'https://itch.io/embed/170228?bg_color=e1daf6&fg_color=222222&link_color=d2d079&border_color=a589c1',
                    width: '280', height: '167' }),
                React.createElement('iframe', { frameBorder: '0',
                    src: 'https://itch.io/embed/116068?bg_color=edf7f8&fg_color=222222&link_color=5c99fa&border_color=c1c5c5',
                    width: '280', height: '167' }),
                React.createElement('iframe', { frameBorder: '0',
                    src: 'https://itch.io/embed/136767?bg_color=e79797&fg_color=222222&link_color=f0b214&border_color=ff2525',
                    width: '280', height: '167' }),
                React.createElement('iframe', { frameBorder: '0',
                    src: 'https://itch.io/embed/122302?bg_color=eeffff&fg_color=222222&link_color=49a2ac&border_color=bebebe',
                    width: '280', height: '167' })
            ),
            React.createElement(
                'div',
                { style: {
                        display: this.shouldShowTab('videos') ? 'flex' : 'none',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'
                    } },
                React.createElement('iframe', { style: {
                        height: 60,
                        width: 180,
                        border: 0
                    }, src: '/youtube-button/' })
            ),
            React.createElement(
                'div',
                { style: {
                        borderTop: "1px solid #E0ECEF",
                        padding: '5px 150px',
                        display: this.shouldShowTab('videos') ? 'flex' : 'none',
                        justifyContent: 'center',
                        textAlign: 'center',
                        flexWrap: 'wrap'
                    } },
                this.state.videos.map(video => {
                    return React.createElement(
                        'div',
                        { className: 'youtubeThumbnail',
                            style: {
                                fontFamily
                            } },
                        React.createElement('div', { className: 'youtubeImage',
                            onClick: e => this.openYoutube(video.id),
                            style: {
                                backgroundImage: `url(${video.url})`
                            } }),
                        React.createElement(
                            'div',
                            null,
                            video.title
                        )
                    );
                })
            ),
            React.createElement(
                'div',
                { style: {
                        display: this.shouldShowTab('games') ? 'flex' : 'none',
                        fontFamily,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                    } },
                React.createElement(
                    'h2',
                    null,
                    'More games ',
                    React.createElement(
                        'a',
                        { target: '_blank', href: 'https://dobuki.weebly.com/' },
                        'here'
                    )
                )
            ),
            React.createElement(
                'div',
                { style: {
                        display: this.shouldShowTab('projects') ? 'flex' : 'none',
                        fontFamily,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                    } },
                React.createElement(
                    'h2',
                    null,
                    'More projects ',
                    React.createElement(
                        'a',
                        { target: '_blank', href: 'https://github.com/jacklehamster?tab=repositories' },
                        'here'
                    )
                )
            ),
            React.createElement(
                'div',
                { style: {
                        display: this.shouldShowTab('videos') ? 'flex' : 'none',
                        fontFamily,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                    } },
                React.createElement(
                    'h2',
                    null,
                    'More videos ',
                    React.createElement(
                        'a',
                        { target: '_blank', href: 'https://youtube.com/vincentlequang2' },
                        'here'
                    )
                )
            ),
            React.createElement(
                'div',
                { style: {
                        width: '100%',
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: -193
                    } },
                React.createElement('img', { style: {
                        height: 245
                    }, src: '/assets/upsidedown-penguin.png' })
            ),
            React.createElement(
                'div',
                { style: { textAlign: 'right', fontSize: 10 } },
                'Site by ',
                React.createElement(
                    'a',
                    { rel: 'author', href: 'https://plus.google.com/u/4/107340140805357940387' },
                    'Jack Le Hamster'
                )
            )
        );
    }
}
//# sourceMappingURL=homepage.js.map