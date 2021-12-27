import { HttpException, HttpStatus } from '@nestjs/common';

export class FilterException extends HttpException {
  constructor(error: any) {
    const { status, response, message } = error;
    const statusCode = status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    super({ message, errorCode: 5000, ...response }, statusCode);
  }
}