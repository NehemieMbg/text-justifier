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
    const words: string[] = text.split(' ');
    const wordCount: number = words.length;

    const user: User = await this.authService.findOne(username);

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please create a token first.',
      );
    }

    const todayDate: string = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Check if the user's justification is for today
    if (user.lastJustified !== todayDate) {
      user.dailyWordCount = 0; // Reset word count if it's a new day
      user.lastJustified = todayDate;
    }

    // Verify if adding new words exceeds the daily limit
    if (user.dailyWordCount + wordCount > this.maxWordsPerDay) {
      throw new HttpException(
        'Daily word limit exceeded (80,000 words)',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    // Update the user's word count
    user.dailyWordCount += wordCount;

    // Save the user with updated word count and date
    await this.userRepository.save(user);

    // Return justified text
    return this.fullJustify(words, maxWidth);
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
