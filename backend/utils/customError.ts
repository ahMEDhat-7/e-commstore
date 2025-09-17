export class CustomError extends Error {
  statusCode: number;

  constructor(statCode: number, msg: string) {
    super();
    this.message = msg;
    this.statusCode = statCode;
  }
}
