export class JustifyService {
  /**
   * Justifies the given text to the specified maximum width.
   *
   * @param text - The text to be justified.
   * @param maxWidth - The maximum width of each line. Default is 80.
   * @returns The justified text.
   */
  justifyText(text: string, maxWidth: number = 80): string {
    return this.fullJustify(text.split(' '), maxWidth);
  }

  /**
   * Fully justifies the given words to the specified maximum width.
   *
   * @param words - The words to be justified.
   * @param maxWidth - The maximum width of each line.
   * @returns The fully justified text.
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
