class HeaderTitle extends React.Component {
    render() {
        const divStyle = {
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const h1Style = {
            fontSize: 42,
            fontFamily: 'ComicAndy, "Comic Sans MS"',
            margin: 0
        };

        return React.createElement(
            'div',
            { style: divStyle },
            React.createElement('img', { style: { width: 50, height: 50 }, src: this.props.icon }),
            React.createElement(
                'h1',
                { style: h1Style },
                this.props.title
            )
        );
    }
}
//# sourceMappingURL=components.js.map