import { LinkedList } from "@figliolia/data-structures";
import type { Loader, PriorityLevel } from "./types";

export class PriorityQueue {
  private running = false;
  private yieldTime: number;
  public static readonly N = 2;
  private readonly storage = new Array<LinkedList<Loader>>(PriorityQueue.N);
  constructor(yieldTime = 5) {
    this.yieldTime = yieldTime;
  }

  public enqueue<T>(priority: PriorityLevel, value: Loader<T>) {
    this.validatePriority(priority);
    return new Promise<T>((resolve, reject) => {
      const bucket = this.storage[priority] || new LinkedList();
      bucket.push(async () => {
        try {
          const returnValue = value();
          if (returnValue instanceof Promise) {
            const resolvedValue = await returnValue;
            resolve(resolvedValue);
          } else {
            resolve(returnValue);
          }
        } catch (error) {
          reject(error);
        }
      });
      this.storage[priority] = bucket;
      if (!this.running) {
        void Promise.resolve().then(() => this.execute());
      }
    });
  }

  public async execute() {
    if (this.running) {
      return;
    }
    this.running = true;
    while (!this.isEmpty) {
      if (this.isInputPending) {
        await this.yield();
        continue;
      }
      void this.dequeue?.()?.();
    }
    this.running = false;
  }

  public dequeue() {
    for (const bucket of this) {
      return bucket.shift();
    }
  }

  public get isEmpty() {
    for (const _ of this) {
      return false;
    }
    return true;
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
    return false;
  }

  private yield(wait = this.yieldTime) {
    return new Promise(resolve => {
      setTimeout(resolve, wait);
    });
  }

  *[Symbol.iterator]() {
    for (const bucket of this.storage) {
      if (bucket && bucket.size) {
        yield bucket;
      }
    }
  }
}
