class ResponseBuilder {
    constructor(status, error, message = null, data = null) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.data = data;
    }

    toJson() {
        return {
            status: this.status,
            error: this.error,
            message: this.message,
            data: this.data
        };
    }

    static success(message, data = null) {
        return new ResponseBuilder("success", false, null, data ).toJson();
    }

    static error(message) {
        return new ResponseBuilder("error", true, message, null).toJson();
    }
}

module.exports = ResponseBuilder;