import PropertyListener from "./Listener"; 

// This will control anything that happens inside Main view

class MainController {
    private static instance: MainController | null = null;
    private counterProperty: PropertyListener<number> = new PropertyListener<number>(0);
  
    // Private constructor to prevent instantiation from outside
    private constructor() {
      // Initialization code here
    }
  
    // Static method to retrieve the single instance
    public static getInstance(): MainController {
      if (!MainController.instance) {
        MainController.instance = new MainController();
      }
      return MainController.instance;
    }
  
    // Other methods and properties can be added as needed
    // Getter for the counter property
    public getCounterProperty(): PropertyListener<number> {
        return this.counterProperty;
    }

    // Method to increase the counter value
    public increaseCounter(): void {
        const newValue = this.counterProperty.getValue() + 1;
        this.counterProperty.setValue(newValue);
    }
  }

export default MainController