class ElementView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: !navigator.onLine
        };
        window.addEventListener('online', this.onlineChange.bind(this));
        window.addEventListener('offline', this.onlineChange.bind(this));
    }

    onlineChange() {
        this.setState({
            disabled: !navigator.onLine
        });
    }

    format() {
        if (this.props.prefix !== '') {
            const split = this.props.word.split(new RegExp(this.props.prefix, 'i'));
            return split.map((element, index, array) => {
                return index >= array.length - 1 ? element : [element, React.createElement(
                    'span',
                    { style: {
                            backgroundColor: 'yellow'
                        } },
                    this.props.prefix
                )];
            });
        }
        return React.createElement(
            'span',
            null,
            this.props.word
        );
    }

    onClickEdit() {
        this.props.editCallback(this.props.row);
    }

    onClick() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        //        localStorage.setItem(`lastService_${this.props.name}`, now.getTime());
        /*        if(this.props.expire) {
                } else {
                    localStorage.clear(`lastService_${this.props.name}`);
                }
                console.log(this.props);*/

        this.setState({
            disabled: true
        }, () => {
            //            this.props.refreshCallback(this.props.prefix);
            updateDate(this.props.row, now.toLocaleDateString('en'), () => {
                this.props.refreshCallback(this.props.prefix);
                this.setState({
                    disabled: !navigator.onLine
                });
            });
        });

        //        this.props.refreshCallback(this.props.prefix);
        //        console.log(this.props.row, now.toLocaleDateString());

        /*        const request = new XMLHttpRequest();
                request.open('POST',`last_service?id=${this.props.name}&set=${!this.props.expire}`,true);
                request.addEventListener('load', function(e) {
                    console.log(request.response);
                });
                request.send();*/
    }

    render() {
        return React.createElement(
            'div',
            {
                className: 'text',
                style: {
                    fontSize: 18,
                    borderBottom: "1px gray solid",
                    //                maxHeight: 36,
                    overflow: 'hidden',
                    color: this.props.expire ? '#b00' : '#000'
                } },
            React.createElement(
                'pre',
                null,
                this.format()
            ),
            React.createElement(
                'button',
                {
                    disabled: this.state.disabled,
                    style: {
                        height: 30,
                        fontSize: 18
                    },
                    onClick: this.onClick.bind(this) },
                loc('Service Done Today')
            ),
            React.createElement(
                'button',
                {
                    disabled: this.state.disabled,
                    style: {
                        height: 30,
                        fontSize: 18
                    },
                    onClick: this.onClickEdit.bind(this) },
                loc('Edit')
            )
        );
    }
}

class ListView extends React.Component {
    constructor(props) {
        super(props);
    }

    renderElements() {
        return this.props.list.map(element => {
            return React.createElement(ElementView, { prefix: this.props.prefix,
                name: element.name, word: element.word, expire: element.expire,
                row: element.row,
                refreshCallback: this.props.refreshCallback,
                editCallback: this.props.editCallback
            });
        });
    }

    render() {
        return React.createElement(
            'div',
            null,
            this.renderElements()
        );
    }
}

class AddView extends React.Component {
    render() {
        return React.createElement(
            'div',
            { style: this.props.style },
            React.createElement(
                'button',
                {
                    disabled: this.props.disabled,
                    onClick: this.props.onClick, style: {
                        fontSize: 20,
                        width: "100%",
                        backgroundColor: 'silver',
                        height: '100%'
                    } },
                loc('Add')
            )
        );
    }
}

class AddInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    componentDidMount() {
        if (isDate(this.props.field)) {
            $(`#field_${this.props.index}`).pickadate({
                hiddenPrefix: `field_${this.props.index}`,
                close: loc('close')
            });
        }
    }

    getValue() {
        if (isDate(this.props.field)) {
            return $(`input[name=field_${this.props.index}_submit]`)[0].value;
        }
        return this.refs.input.value;
    }

    onChange(value) {
        this.setState({
            value
        });
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { style: {
                        fontSize: 24
                    } },
                loc(this.props.field)
            ),
            hasDropDown(this.props.field) ? React.createElement(
                'select',
                { ref: 'input', value: this.state.value,
                    onChange: e => this.onChange(e.target.value),
                    style: {
                        width: 100,
                        height: 48,
                        margin: -1,
                        fontSize: 24
                    }
                },
                hasDropDown(this.props.field).map(choice => React.createElement(
                    'option',
                    { value: choice },
                    loc(choice)
                ))
            ) : React.createElement('input', { className: isDate(this.props.field) ? 'datepicker' : '',
                id: `field_${this.props.index}`, ref: 'input', style: {
                    width: '100%',
                    border: '1px solid black',
                    height: 48,
                    margin: -1,
                    fontSize: 24
                },
                value: this.state.value,
                'data-value': isDate(this.props.field) && this.state.value ? new Date(this.state.value).toISOString().slice(0, 10) : '',
                onChange: e => this.onChange(e.target.value)
            })
        );
    }
}

class LanguageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dictionary: props.dictionary,
            prefix: props.search
        };
        const list = this.updateList(props.search || '', this.state);
        this.state.mode = null;
        this.state.fields = [];
        this.state.rowEdited = 0;
        this.state.disabled = !navigator.onLine;
        window.addEventListener('online', this.onlineChange.bind(this));
        window.addEventListener('offline', this.onlineChange.bind(this));
    }

    onlineChange() {
        this.setState({
            disabled: !navigator.onLine
        });
    }

    setDictionary(dictionary, search) {
        const self = this;
        this.setState({
            dictionary,
            prefix: search
        }, () => {
            self.onChange();
        });
    }

    onChange() {
        if (this.refs.input) this.updateList(this.refs.input.value);
    }

    updateList(prefix, state) {
        const monthCounts = [];
        let expireCount = 0;
        let list = this.state.dictionary;
        list.forEach(elem => {
            monthCounts[elem.nextDue.getMonth() + 1] = (monthCounts[elem.nextDue.getMonth() + 1] || 0) + 1;
            if (elem.expire) {
                expireCount++;
            }
        });
        list = list.filter(entry => {
            const word = entry.text;
            return word.toLocaleLowerCase().indexOf(prefix.toLocaleLowerCase()) >= 0;
        });
        const count = list.length;
        list = list.map(entry => {
            const word = entry.text;
            return {
                word: word,
                pos: word ? word.indexOf(prefix) : -1,
                name: entry.name,
                expire: entry.expire,
                row: entry.row,
                nextDue: entry.nextDue
            };
        });

        list.sort((a, b) => {
            if (a.expire !== b.expire) {
                return a.expire ? -1 : 1;
            }
            if (a.nextDue.getTime() !== b.nextDue.getTime()) {
                return a.nextDue.getTime() - b.nextDue.getTime();
            }

            return a.pos - b.pos;
        });
        //        list = list.slice(0, 10);
        //        list = list.map(element => element.word);
        if (state) {
            state.prefix = prefix;
            state.list = list;
            state.count = count;
            state.monthCounts = monthCounts;
            state.expireCount = expireCount;
        } else {
            this.setState({
                prefix,
                list,
                count,
                monthCounts,
                expireCount
            });
        }
        return list;
    }

    onAddMode(row) {
        this.setState({
            mode: 'add',
            rowEdited: row || 0
        });
    }

    onCancel() {
        this.setState({
            mode: null
        });
    }

    onAdd() {
        const values = [];
        this.state.fields.forEach((field, index) => {
            const input = this.refs[`addinput_${index}`];
            values[index] = input ? input.getValue() : '';
        });
        updateValues(this.state.rowEdited, values, () => {
            this.props.refreshCallback(this.state.prefix);
            this.setState({
                mode: null
            });
        });
    }

    dueMonth(month) {
        this.setSearch(`${loc('month')}: ${month}.`);
    }

    clearFilter() {
        this.setSearch('');
    }

    setSearch(search) {
        const self = this;
        this.setState({
            prefix: search
        }, () => {
            self.onChange();
        });
    }

    setFields(fields) {
        this.setState({
            fields
        });
    }

    getAddForm(row) {
        let list = this.state.dictionary;
        const entry = list[row - headerRowCount - 1];

        return this.state.fields.map((field, index) => {
            return field === 'row' ? [] : React.createElement(AddInput, {
                ref: `addinput_${index}`, field: field, index: index,
                value: entry ? entry.values[field] : ''
            }); /*[
                 <div style={{
                     fontSize: 24,
                 }}>{loc(field)}</div>,
                 <input className={'datepicker'} ref={`field_${index}`} style={{
                     width: '100%',
                     border: '1px solid black',
                     height: 48,
                     margin: -1,
                     fontSize: 24,
                 }}/>,
                ];*/
        });
    }

    render() {
        return React.createElement(
            'div',
            null,
            this.state.mode === 'add' ? React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { style: {
                            marginBottom: 20
                        } },
                    this.getAddForm(this.state.rowEdited)
                ),
                React.createElement(
                    'button',
                    { style: {
                            fontSize: 20,
                            width: "50%",
                            backgroundColor: '#ada',
                            //                    position: 'fixed',
                            bottom: 0
                        }, onClick: this.onAdd.bind(this) },
                    loc('Save')
                ),
                React.createElement(
                    'button',
                    { style: {
                            fontSize: 20,
                            color: '#faa',
                            left: '50%',
                            width: "50%",
                            backgroundColor: '#a00',
                            //                    position: 'fixed',
                            bottom: 0
                        }, onClick: this.onCancel.bind(this) },
                    loc('Cancel')
                )
            ) : React.createElement(
                'div',
                null,
                React.createElement(AddView, {
                    disabled: this.state.disabled,
                    style: {
                        //                    position: 'fixed',
                        width: '100%',
                        bottom: 0
                    }, onClick: () => this.onAddMode.bind(this)(0) }),
                React.createElement('input', {
                    ref: 'input',
                    value: this.state.prefix,
                    style: {
                        border: '1px solid black',
                        margin: -1,
                        width: '100vw',
                        height: 24,
                        fontSize: 24
                    }, onChange: this.onChange.bind(this) }),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        null,
                        this.state.count,
                        ' ',
                        loc('entries')
                    ),
                    '\xA0',
                    React.createElement(
                        'button',
                        { disabled: this.state.prefix === '', onClick: this.clearFilter.bind(this) },
                        loc('Clear')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[1], onClick: () => this.dueMonth(1) },
                        loc('Jan')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[2], onClick: () => this.dueMonth(2) },
                        loc('Feb')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[3], onClick: () => this.dueMonth(3) },
                        loc('Mar')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[4], onClick: () => this.dueMonth(4) },
                        loc('Apr')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[5], onClick: () => this.dueMonth(5) },
                        loc('May')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[6], onClick: () => this.dueMonth(6) },
                        loc('Jun')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[7], onClick: () => this.dueMonth(7) },
                        loc('Jul')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[8], onClick: () => this.dueMonth(8) },
                        loc('Aug')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[9], onClick: () => this.dueMonth(9) },
                        loc('Sep')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[10], onClick: () => this.dueMonth(10) },
                        loc('Oct')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[11], onClick: () => this.dueMonth(11) },
                        loc('Nov')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.monthCounts[12], onClick: () => this.dueMonth(12) },
                        loc('Dec')
                    ),
                    React.createElement(
                        'button',
                        { disabled: !this.state.expireCount, onClick: () => this.setSearch(`${loc('expire')}: ${loc('YES')}`) },
                        loc('Expired')
                    )
                ),
                React.createElement(ListView, { prefix: this.state.prefix, list: this.state.list, refreshCallback: this.props.refreshCallback,
                    editCallback: this.onAddMode.bind(this) })
            )
        );
    }
}

class Main {
    static setupView(root, dictionary, refreshCallback, search) {
        return ReactDOM.render(React.createElement(LanguageView, { search: search || '', dictionary: dictionary, refreshCallback: refreshCallback }), root);
    }
}
//# sourceMappingURL=translator.js.map