export class ApiError extends Error {
  constructor(status, message, code = 'REQUEST_FAILED', details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isDuplicateKeyError(error) {
  return error && error.code === 'ER_DUP_ENTRY';
}
