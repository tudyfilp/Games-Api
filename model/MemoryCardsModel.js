class MemoryCardsModel{
    constructor(){

        this.session = {
          availablePlaces:4,
          gameEnded:false,
          timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
          activeUser: "",
          users: {}
        }
    
    }

}

module.exports = MemoryCardsModel;