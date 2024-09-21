export class LazyInitializer<T> {
  private value: T | undefined;

  constructor(private readonly initializer: () => T) {}

  get(): T {
    if (this.value === undefined) {
      this.value = this.initializer();
    }

    return this.value;
  }
}
