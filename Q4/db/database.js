var mongoose = require('mongoose');

const server = "0.0.0.0:27017"
const Database = "studentMasters"

class database {
    constructor() {
        this._connect()
    }
    async _connect() {
        try {
            await mongoose.connect(`mongodb://${server}/${Database}`)
            console.log(`database connection successfull`)
        } catch (error) {
            console.error('Database connection error: ' + error);
        }
    }
}

module.exports = new database()