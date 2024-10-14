import { User } from '../auth/user.entity';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

export class JustifyService {
  private readonly maxWordsPerDay: number = 80_000;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Justifies the given text to the specified maximum width.
   *
   * @param {string} text - The text to be justified.
   * @param {string} username - The username of the user requesting justification.
   * @param {number} [maxWidth=80] - The maximum width of each line. Default is 80.
   * @returns {Promise<string>} - The justified text.
   * @throws {HttpException} - If the daily word limit is exceeded.
   */
  async justifyText(
    text: string,
    username: string,
    maxWidth: number = 80,
  ): Promise<string> {
    const words = text.split(' ');
    const wordCount = words.length;

    const user = await this.authService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    this.checkAndResetDailyWordCount(user);

    if (this.exceedsDailyLimit(user.dailyWordCount, wordCount)) {
      throw new HttpException(
        'Daily word limit exceeded (80,000 words)',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    user.dailyWordCount += wordCount;
    await this.userRepository.save(user);

    return this.fullJustify(words, maxWidth);
  }

  /**
   * Checks if the user's daily word count needs to be reset.
   *
   * @param {User} user - The user object.
   */
  private checkAndResetDailyWordCount(user: User): void {
    const todayDate = new Date().toISOString().split('T')[0];
    if (user.lastJustified !== todayDate) {
      user.dailyWordCount = 0;
      user.lastJustified = todayDate;
    }
  }

  /**
   * Checks if the new word count exceeds the daily limit.
   *
   * @param {number} currentCount - The current daily word count.
   * @param {number} newCount - The new word count to be added.
   * @returns {boolean} - True if the new count exceeds the limit, false otherwise.
   */
  private exceedsDailyLimit(currentCount: number, newCount: number): boolean {
    return currentCount + newCount > this.maxWordsPerDay;
  }

  /**
   * Fully justifies the given words to the specified maximum width.
   *
   * @param {string[]} words - The words to be justified.
   * @param {number} maxWidth - The maximum width of each line.
   * @returns {string} - The fully justified text.
   */
  private fullJustify(words: string[], maxWidth: number): string {
    const result: string[] = [];
    let index = 0;

    while (index < words.length) {
      const line: string[] = [];
      let lineLength = 0;

      // ? Build the current line by adding words until the maxWidth limit is reached
      while (
        index < words.length &&
        lineLength + words[index].length + line.length <= maxWidth
      ) {
        line.push(words[index]);
        lineLength += words[index].length;
        index++;
      }

      // ? If it's the last line or there's only one word in the line, left-justify it
      if (index === words.length || line.length === 1) {
        result.push(
          // ? Using \u00A0 (non-breaking space) instead of ' ' because ' ' doesn't work for justification
          line.join('\u00A0') +
            '\u00A0'.repeat(maxWidth - lineLength - (line.length - 1)),
        );
      } else {
        // ? Fully justify the current line by distributing extra spaces evenly
        const extraSpace = maxWidth - lineLength;
        const spacesBetweenWords = Math.floor(extraSpace / (line.length - 1));
        let remainder = extraSpace % (line.length - 1);

        // ? Add calculated spaces between words
        for (let i = 0; i < line.length - 1; i++) {
          line[i] += '\u00A0'.repeat(spacesBetweenWords);

          // ? Distribute the remainder (one extra space) to the leftmost gaps
          if (remainder > 0) {
            line[i] += '\u00A0';
            remainder--;
          }
        }

        // ? Join the words to form the fully justified line
        result.push(line.join(''));
      }
    }

    // ? Join the lines with newline characters and ensure no double newlines
    return result.join('\n').split('\n\n').join('\n');
  }
}
