type Listener = (isLoading: boolean) => void;

class LoaderTrigger {
  private count = 0;
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const isLoading = this.count > 0;
    this.listeners.forEach((listener) => listener(isLoading));
  }

  show() {
    this.count++;
    if (this.count === 1) {
      this.notify();
    }
  }

  hide() {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) {
      this.notify();
    }
  }

  // Force reset if needed
  reset() {
    this.count = 0;
    this.notify();
  }
}

export const loaderTrigger = new LoaderTrigger();
