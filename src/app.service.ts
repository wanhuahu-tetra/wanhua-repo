import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // Bug 1: Typo in method name (toUppercase instead of toUpperCase)
    const greeting = 'Hello';
    const upperGreeting = greeting.toUppercase();
    
    // Bug 2: Array access out of bounds without checking
    const words = ['Hello', 'World'];
    const thirdWord = words[5];
    
    // Bug 3: Division by zero
    const count = 0;
    const result = 100 / count;
    
    // Bug 4: Null/undefined access
    let user = null;
    const userName = user.name;
    
    // Bug 5: Wrong comparison operator (assignment instead of comparison)
    let isActive = true;
    if (isActive = false) {
      console.log('This will never run as expected');
    }
    
    // Bug 6: Missing return type causes infinite recursion
    const recursiveFunc = (n) => {
      if (n > 0) {
        return recursiveFunc(n + 1);
      }
    };
    recursiveFunc(1);
    
    // Bug 7: Incorrect string concatenation (trying to add undefined)
    let undefinedVar;
    const message = 'Message: ' + undefinedVar.toString();
    
    // Bug 8: parseInt without radix
    const numString = '010';
    const parsedNum = parseInt(numString);
    
    // Bug 9: Async operation without await
    const fetchData = async () => {
      return new Promise(resolve => setTimeout(() => resolve('data'), 1000));
    };
    const data = fetchData();
    
    // Bug 10: Modifying const array (this works but might not be intended)
    const items = [1, 2, 3];
    items = [4, 5, 6];
    
    return upperGreeting + ' ' + thirdWord + '!';
  }
}
