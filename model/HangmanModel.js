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
          activeUsers: [],
          users: {}
        }
      this.nrOfLivesPerActiveUser = 4;
    }

    get availablePlaces() {
      return this.session.availablePlaces;
    }

}

module.exports = HangmanModel;