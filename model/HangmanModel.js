var firebase = require('firebase/app');
require('firebase/firestore');

class HangmanModel{
    constructor(){

        this.session = {
          availablePlaces: 4,
          gameEnded: false,
          phrase: "",
          completedPhrase: [],
          phraseLetters: {},
          phraseCategory: "",
          guessedLetters: [],
          timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
          initialNumberOfLives: 4,
          activeUser: "",
          users: {} /// key: score
        }
      this.nrOfLivesPerActiveUser = 4;
    }

}

module.exports = HangmanModel;