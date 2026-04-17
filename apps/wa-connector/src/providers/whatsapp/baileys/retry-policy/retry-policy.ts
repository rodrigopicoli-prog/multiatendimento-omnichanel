export class RetryPolicy {
  constructor(private readonly maxRetries = 5) {}

  shouldReconnect(attempt: number) {
    return attempt < this.maxRetries;
  }

  backoffMs(attempt: number) {
    return Math.min(5000 * attempt, 30_000);
  }
}
