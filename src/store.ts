import { OptimizelyUserContext } from '@optimizely/optimizely-sdk';

interface iState {
  userContext: OptimizelyUserContext | null;
}

class Observable {
  private observers: Array<(state: iState, prevState?: iState) => void>;
  private state: iState;

  constructor() {
    this.observers = [];
    this.state = {
      userContext: null,
    };
  }

  subscribe(callback: (state: iState, prevState?: iState) => void) {
    this.observers.push(callback);
  }

  unsubscribe(callback: (state: iState, prevState?: iState) => void) {
    this.observers = this.observers.filter(observer => observer !== callback);
  }

  updateStore(newState: iState) {
    return { ...this.state, ...JSON.parse(JSON.stringify(newState)) };
  }

  setState(newStore: iState) {
    const prevState = { ...this.state };
    this.state = this.updateStore(newStore);
    this.notify(prevState);
  }

  notify(prevState: iState) {
    this.observers.forEach(callback => callback(this.state, prevState));
  }
}

const store = (function() {
  let instance: Observable;

  return {
    getInstance: function() {
      if (!instance) {
        instance = new Observable();
      }
      return instance;
    },
  };
})();

export default store;
