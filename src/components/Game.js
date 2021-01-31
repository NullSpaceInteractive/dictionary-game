import React from 'react';
import words from "../data/words.txt";
import '../css/header.css';
import loadingIcon from '../loading.svg'
import '../css/wordgame.css'
import End from './End.js'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loadingMessage: 'Loading...',
            currentWord: '',
            currentDefinition: "",
            partOfSpeech: "",
            lengthTest: "",
            guessed: false,
            correct: false,
            points: 0,
            attemptsLeft: 30
        }
    }
    

    async componentDidMount() {
        await this.refresh()
    }


    // https://stackoverflow.com/questions/33289726/combination-of-async-function-await-settimeout
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // https://dictionaryapi.dev/ API call
    async getDefinition(word) {
        let def = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en_US/" + word)
            .then(response => {
                if (response.status === 200){
                    return response.json()
                } else {
                    return null;
                }
            });
        if (def == null) {
            await this.timeout(1000)
            return this.getWord().then(w => this.getDefinition(w))
        } else {
            return def
        }
    }

    // Word list obtained from https://github.com/aaronbassett/Pass-phrase
    getWord = () => {
        return fetch(words)
           .then(r => r.text())
           .then(text => text.split('\n'))
           .then(lines => lines[Math.floor(Math.random() * lines.length)])
    }

    checkGuess = async (guess) => {
        let word = this.state.currentWord;
        await this.setState({guessed: true})
        await this.setState({lengthText: this.state.currentWord.split("").join(" ").trim()})
        if (guess === word) {
            console.log("Correct!")
            await this.setState({correct: true})
        } else {
            console.log("Wrong!")
            console.log("Correct answer is: " + this.state.currentWord);
            await this.setState({correct: false})
        }
        await this.nextWord()
    }

    refresh = async () => {
        if (document.getElementById('guess') != null){
            document.getElementById('guess').value = '';
        }
        await this.setState({correct: false});
        await this.setState({guessed: false});
        await this.setState({loading: true});
        await this.updateDefinition()
            .catch(() => {
                console.log("Trying again...");
                setTimeout(() => {this.updateDefinition()}, 1000)
            });
        await this.setState({loading: false})
        await this.setState({lengthText: "_ ".repeat(this.state.currentWord.length).trim()})
    }

    updateDefinition = () => {
        return this.getWord().then(word => this.getDefinition(word)).then(data => {
            this.setState({currentWord: data[0]['word']})
            this.setState({currentDefinition: data[0]['meanings'][0]['definitions'][0]['definition']})
            this.setState({partOfSpeech: data[0]['meanings'][0]['partOfSpeech']})
        })
    }

    async nextWord(){
        if (this.state.correct){
            await this.setState({points: this.state.points + 1})
            console.log(this.state.points)
        }
        if (this.state.attemptsLeft > 0){
            await this.setState({attemptsLeft: this.state.attemptsLeft - 1})
        } else {
            this.endGame()
        }
        console.log("Waiting...")
        setTimeout(() => {console.log("Done!");this.refresh()}, 2000);
    }

    endGame(){

    }

    sumbitScore(){
        //Submit score callback from button
        //Summon Leaderboard component
    }

    submit = (event) => {
        event.preventDefault();
        if (!this.state.guessed) {
            this.checkGuess(document.getElementById('guess').value.toLowerCase())
        }
    }

    render() {
        if (this.state.attemptsLeft > 0) {
            return (
                <div className="App">
                    <header className="App-header">
                        The Dictionary Game
                    </header>
                    <div className="App-body">
                        <p>{"Score: " + this.state.points + "/30"}</p>{!this.state.loading ?
                        <form className="empty-div" onSubmit={this.submit}>
                            {this.state.correct ?
                                <h1 className="guess-correct">Correct!</h1>
                                : !this.state.guessed ?
                                    <h1>{"(" + this.state.partOfSpeech + ") " + this.state.currentDefinition}</h1>
                                    :
                                    <h1 className="guess-incorrect">Incorrect, the correct answer is</h1>
                            }
                            {this.state.guessed && this.state.correct ?
                                <h2 class='guess-correct'><b>{this.state.lengthText}</b></h2>
                                : this.state.guessed && !this.state.correct ?
                                    <h2 className='guess-incorrect'><b>{this.state.lengthText}</b></h2>
                                    :
                                    <h2><b>{this.state.lengthText}</b></h2>
                            }

                            <div className="same-line">
                                <input placeholder="guess here..." id='guess' autoFocus={true} autoComplete="off"/>
                                <button onClick={this.submit}>Check</button>
                            </div>
                        </form>
                        :
                        <img src={loadingIcon} id='loadingImage' alt='memes'/>
                    }
                    </div>
                </div>
            )
        } else {
            return (<End score={this.state.points}/>)
        }
    }
}

export default Game;