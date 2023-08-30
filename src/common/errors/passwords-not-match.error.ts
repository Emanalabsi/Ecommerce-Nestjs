import { HttpStatus, HttpException } from '@nestjs/common';

export class PasswordsDoesntMatch extends HttpException {
  constructor() {
    super(
      'User account was found but credentials were not correct.',
      HttpStatus.FORBIDDEN,
    );
  }
}
