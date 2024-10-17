class TimeFormatter {
  /**
   * Takes a time in milliseconds and returns a string that is in the format
   * 'DD day hh:mm:ss'
   * @param {number} ms - The time in milliseconds
   * @returns {string} The formatted string
   */
  static format = (ms: number): string => {
    const seconds = ms / 1000;
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const outSeconds = Math.floor(seconds % 60);
    return `${days ? `${days}d:` : ""}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${outSeconds.toString().padStart(2, "0")}`;
  };
}

export default TimeFormatter;
