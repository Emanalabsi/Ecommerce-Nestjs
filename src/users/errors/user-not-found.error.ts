import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFound extends HttpException {
  constructor() {
    super(
      'User with such email and password could not be found.',
      HttpStatus.NOT_FOUND,
    );
  }
}
