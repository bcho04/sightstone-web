import React from "react";

class Text extends React.Component {
    render(){
        return (
            <div className={this.props.className}>
                <p>{this.props.text}</p>
            </div>
        );
    }
}

export default Text;
