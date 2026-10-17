export class ApiError extends Error {
    constructor(public status: number, message: string) { super(message) }
}
export class BadRequestError extends ApiError {
    constructor(message: string) { super(400, message) }
}
