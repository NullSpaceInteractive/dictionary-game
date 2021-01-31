import React from "react";
import '../css/App.css';

class End extends React.Component {
    render() {
        return (
            <div className= "App">
                <header className="App-header">
                    The Dictionary Game
                </header>
                <div className = "App-body">
                    <div className="empty-div">
                        <h1> Congrats! </h1>
                        <h2> Final Score: {this.props.score}/30</h2>
                    </div>
                </div>
            </div>
        )
    }
}

export default End;