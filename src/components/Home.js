import React from "react";
import '../css/App.css';
import {Redirect} from "react-router-dom";

class Home extends React.Component {
    state = {
        began: false,
    }

    begin = async (event) => {
        event.preventDefault();
        await this.setState({began: true});
    }

    render() {
        return (
            <div className= "App">
                <header className="App-header">
                    The Dictionary Game
                </header>
                <div className = "App-body">
                    <div className="empty-div">
                        <h1>The Dictionary Game:</h1>
                        <h2>Given a random definition, the part of speech, and the word length, determine the corresponding word </h2>
                        <form onSubmit={this.begin} autoFocus={true}>
                            <button onClick={this.begin}>Begin</button>
                        </form>
                        {this.state.began ? <Redirect to="/game"/> : <div/>}
                    </div>
                </div>
                <h5 className='footer'>This is a very unfair game because synonyms do NOT count so think well and hard. There may be some naughty words that come up and we do not take responsibility for any emotional or moral damages.</h5>
            </div>
        )
    }
}

export default Home;