type ListenerCallback<T> = (value: T) => void;

class PropertyListener<T> {
  private value: T;
  private listeners: ListenerCallback<T>[] = [];

  constructor(value: T) {
    this.value = value;
  }

  // Get the current value
  getValue(): T {
    return this.value;
  }

  // Set the value and notify listeners
  setValue(newValue: T): void {
    this.value = newValue;
    this.notifyListeners();
  }

  // Add a listener
  addListener(listener: ListenerCallback<T>): void {
    this.listeners.push(listener);
  }

  // Remove a listener
  removeListener(listener: ListenerCallback<T>): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.value));
  }
}

export default PropertyListener