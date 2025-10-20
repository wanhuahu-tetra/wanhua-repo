import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const message = 'Hello World!';
    return message.toUpperCase();
  }

  // Fixed: Using comparison operator instead of assignment
  checkUserStatus(isActive: boolean): string {
    if (isActive === true) {
      return 'User is active';
    }
    return 'User is inactive';
  }
}
