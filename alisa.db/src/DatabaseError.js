class DatabaseError {

    constructor(error, code) {
        const dbError = new Error(`[DatabaseError]: ${error}`)
        dbError.code = code
        return dbError
    }

}

module.exports = DatabaseError