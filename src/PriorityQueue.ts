import type { PriorityLevel } from "./types";

export type Loader = () => Promise<any>;

export class PriorityQueue {
  private running = false;
  private yieldTime: number;
  public static readonly N = 2;
  private readonly storage = new Array<Loader[]>(PriorityQueue.N);
  constructor(yieldTime = 5) {
    this.yieldTime = yieldTime;
  }

  public push(priority: PriorityLevel, value: Loader) {
    this.validatePriority(priority);
    const bucket = this.storage[priority] || [];
    bucket.push(value);
    this.storage[priority] = bucket;
    void this.execute();
  }

  public async execute() {
    if (this.running) {
      return;
    }
    this.running = true;
    while (!this.isEmpty) {
      if (this.isInputPending) {
        await this.yield();
      }
      void this.pop?.();
    }
    this.running = false;
  }

  public pop() {
    for (const bucket of this) {
      if (bucket && bucket.length) {
        return bucket.pop();
      }
    }
  }

  public get isEmpty() {
    for (const bucket of this) {
      if (bucket && bucket.length) {
        return false;
      }
    }
    return true;
  }

  *[Symbol.iterator]() {
    for (const bucket of this.storage) {
      if (bucket && bucket.length) {
        yield bucket;
      }
    }
  }

  private validatePriority(priority: PriorityLevel) {
    if (priority >= PriorityQueue.N) {
      throw new Error(`The priority ${priority} is invalid`);
    }
  }

  private get isInputPending() {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      // @ts-ignore
      return navigator?.scheduling?.isInputPending?.() ?? false;
    }
  }

  private yield(wait = this.yieldTime) {
    return new Promise(resolve => {
      setTimeout(resolve, wait);
    });
  }
}
