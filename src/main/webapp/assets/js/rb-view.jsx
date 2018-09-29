//~~ 视图
class RbViewForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { ...props }
    }
    render() {
        let that = this
        return (<div className="rbview-form">
             {this.state.formComponent}
        </div>)
    }
    componentDidMount() {
        let that = this
        $.get(rb.baseUrl + '/app/' + this.props.entity + '/view-modal?id=' + this.props.id, function(res){
            let elements = res.data.elements
            const FORM = <div class="row">{elements.map((item) => {
                return __detectViewElement(item)
            })}</div>
            that.setState({ formComponent: FORM }, function(){
                $('.invisible').removeClass('invisible')
                if (parent && parent.rbViewModal) {
                    parent.rbViewModal.hideLoading(true)
                }
            })
        });
    }
}

const __detectViewElement = function(item){
    item.onView = true
    item.viewMode = true
    return (<div className={'col-12 col-sm-' + (item.isFull ? 12 : 6)}>{__detectElement(item)}</div>)
}