/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  ImageBackground,
} from 'react-native';

import PostGame1 from './PostGame1';
import { ViroARSceneNavigator } from 'react-viro';

const API_KEY = '4B132E39-801E-47A0-8F11-E44215B1CE84';

const DonutDropScene = require('./DonutDropScene');
const backgroundImage = require('../assets/Images/moving_palm_trees2.gif')


const GAME_STATES = {
  INTRODUCTION: 'INTRODUCTION',
  IN_GAME: 'IN_GAME',
  POST_GAME: 'POST_GAME',
};

let timerIntervalId;



export default class DonutDropSceneLoader extends Component {
  constructor() {
    super();
    this.state = {
      gameState: GAME_STATES.INTRODUCTION,
      score: 0,
      timer: 25,
      timeLeft: 25,
      showLeaderboard: false,
    };
    this.startGame = this.startGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.gameEnd = this.gameEnd.bind(this);
    this.incrementScore = this.incrementScore.bind(this);
    this.checkTime = this.checkTime.bind(this);
    this.beginTimer = this.beginTimer.bind(this);
    this.decrementTime = this.decrementTime.bind(this);

  }

  render() {
    switch (this.state.gameState) {
      case GAME_STATES.INTRODUCTION:
        return this.renderIntro();
      case GAME_STATES.IN_GAME:
        return this.renderBallGame();
      case GAME_STATES.POST_GAME:
        return this.renderPostGame();
    }
  }

  // render conditional states

  renderIntro() {
    return (
      <View style={localStyles.outer}>
        <View style={localStyles.inner}>
          <Image
            source={require('../assets/Images/donutDrop.jpg')}
            style={{ width: 300, height: 300 }}
          />
          <Text style={localStyles.text}>
            You have 30 seconds to catch as many donuts as you can in the
            cup. Move your device under the falling donuts to catch them in your
            cup. Avoid the avocado.
          </Text>
          <TouchableHighlight
            style={localStyles.button2}
            onPress={this.startGame}
            underlayColor="#68a0ff"
          >
            <Text style={localStyles.buttonText}>Start</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  renderBallGame() {
    return (
      <View style={localStyles.flex}>
        <ViroARSceneNavigator
          apiKey={API_KEY}
          initialScene={{ scene: DonutDropScene }}
          viroAppProps={{
            gameEnd: this.gameEnd,
            incrementScore: this.incrementScore,
            score: this.state.score,
            timer: this.state.timer,
            beginTimer: this.beginTimer,
          }}
        />
        <View style={localStyles.bottomMenu}>
          <TouchableHighlight
            style={localStyles.buttons}
            underlayColor="#68a0ff"
            onPress={this.props.propObj.returnToMenu}
          >
            <Text style={localStyles.buttonText}>BACK</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={localStyles.buttons}
            underlayColor="#68a0ff"
          >
            <Text style={localStyles.buttonText}>
              Time: {this.state.timeLeft}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={localStyles.buttons}
            underlayColor="#68a0ff"
          >
            <Text style={localStyles.timerText}>
              Score: {this.state.score}
            </Text>
          </TouchableHighlight>
        </View>
        {this.checkTime()}
      </View>
    );
  }

  renderPostGame() {
    return (
      <View>
        <ImageBackground source={backgroundImage} style={{width: '100%', height: '100%'}}>
          <PostGame1
            returnToMenu={this.props.propObj.returnToMenu}
            goToLeaderBoard={this.props.propObj.goToLeaderBoard}
            score={this.state.score}
            resetGame={this.resetGame}
            gameName="DonutDrop"
            showLeaderboard={this.state.showLeaderboard}
          />
        </ImageBackground>
      </View>
    );
  }

  // helper functions

  startGame() {
    this.setState({
      gameState: GAME_STATES.IN_GAME,
    });
  }

  resetGame() {
    this.setState({
      score: 0,
      timer: 30,
      timeLeft: 30,
      gameState: GAME_STATES.INTRODUCTION,
      showLeaderboard: false,
    });
  }

  gameEnd() {
    this.setState({
      gameState: GAME_STATES.POST_GAME,
      timeLeft: 25,
    });
    setTimeout(() => {
      this.setState({
        showLeaderboard: true
      })
    }, 2550)
  }

  incrementScore(colliderTag) {
    this.setState({
      score: this.state.score + 1,
    });
  }

  setTimer(timeDiff) {
    // calc new time
    this.setState({
      timeLeft: this.state.timer - timeDiff,
    });
  }

  checkTime() {
    const timeLeft = this.state.timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerIntervalId);
      this.gameEnd();
    }
  }

  // function that gets run when game starts.
  beginTimer() {
    timerIntervalId = setInterval(this.decrementTime, 1000);
  }

  decrementTime() {
    let currentTime = this.state.timeLeft;
    let newTime = currentTime - 1;
    this.setState({
      timeLeft: newTime,
    });
  }
}

var localStyles = StyleSheet.create({
  viroContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  flex: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  topMenu: {
    width: '100%',
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  inner: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color: '#fff',
    textAlign: 'center',
    fontSize: 25,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  losingText: {
    color: '#ff0000',
    textAlign: 'center',
    fontSize: 40,
  },
  timerText: {
    color: '#ff0000',
    textAlign: 'center',
    fontSize: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "bold",
    fontFamily:'Avenir'
  },
  button2: {
    height: 60,
    width: 90,
    paddingTop: 10,
    paddingBottom: 8,
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'rgba(123,123,231,.4)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(123,087,231,.4)',
  },
  buttons: {
    height: 80,
    width: 110,
    paddingTop: 20,
    paddingBottom: 20,
    margin: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(123,123,231,.4)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(123,087,231,.4)',
  },
  exitButton: {
    height: 50,
    width: 100,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  bottomMenu: {
    width: '100%',
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = DonutDropSceneLoader;
