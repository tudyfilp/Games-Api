var firebase = require('firebase/app');
require('firebase/firestore');

class GameModel{
    constructor(){

        this.session = {
          availablePlaces:4,
          gameEnded:false,
          timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
          activeUser: "",
          activeUsers: [],
          users: {} 
        }
    }
    

}

module.exports = GameModel;