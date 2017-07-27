class Homepage extends Page {
    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(HeaderTitle, {
                title: "Dobuki.net",
                icon: "/assets/dobuki.png" }),
            React.createElement(Login, { url: location.pathname }),
            React.createElement(
                "div",
                { style: { margin: 5, height: 300, display: 'flex' } },
                React.createElement("div", { style: { flex: 1, backgroundColor: 'snow' } })
            )
        );
    }
}
//# sourceMappingURL=homepage.js.map