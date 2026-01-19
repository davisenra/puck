export class ApplicationError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 400);
  }
}
