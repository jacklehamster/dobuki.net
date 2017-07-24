class HomePage extends React.Component {
    render() {
        return (
            <div>
                <HeaderTitle title="DOBUKI.net" icon="/dobuki.png"></HeaderTitle>
                <hr/>
                <div>
                    Welcome to my world
                </div>
            </div>
        );
    }

    static display() {
        ReactDOM.render(
            <HomePage />,
            document.getElementById('root')
        );
    }
}

HomePage.display();