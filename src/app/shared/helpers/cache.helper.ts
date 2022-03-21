export type CachePayload<T> = {
  value: T,
  isExpired: boolean,
}

export class Cache<T> {
  private lastModified: number = 0;

  constructor(
    public value: T,
    private expirationTimeInSeconds: number
  ) {}

  public get(): CachePayload<T> {
    const isExpired = +new Date() - this.lastModified >= this.expirationTimeInSeconds * 1000;

    return {
      value: this.value,
      isExpired,
    };
  }

  public set(value: T): CachePayload<T> {
    this.lastModified = +new Date();
    this.value = value;

    return {
      value,
      isExpired: false,
    };
  }
}
