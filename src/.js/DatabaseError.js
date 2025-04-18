class DatabaseError extends Error {
    constructor(error, code) {
        super(`[DatabaseError]: ${error}`)
        this.name = 'DatabaseError';
        this.code = code;
        this.stack = (new Error()).stack;
        this.timestamp = new Date().toISOString();
        this.message = error;
    }
}

module.exports = DatabaseError