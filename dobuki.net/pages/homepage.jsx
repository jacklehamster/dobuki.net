class Homepage extends Page {
    render() {
        return (<div>
            <HeaderTitle
                title="Dobuki.net"
                icon="/assets/dobuki.png">
            </HeaderTitle>
            <Login url={location.pathname}></Login>
            <div style={{ margin: 5, height: 300, display: 'flex' }}>
                <div style={{ flex: 1, backgroundColor: 'snow' }}>
                </div>
            </div>
        </div>);
    }
}