class HomePage extends React.Component {
    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(HeaderTitle, { title: "DOBUKI.net", icon: "/dobuki.png" }),
            React.createElement("hr", null),
            React.createElement(
                "div",
                null,
                "Welcome to my world"
            )
        );
    }

    static display() {
        ReactDOM.render(React.createElement(HomePage, null), document.getElementById('root'));
    }
}

HomePage.display();
//# sourceMappingURL=homepage.js.map