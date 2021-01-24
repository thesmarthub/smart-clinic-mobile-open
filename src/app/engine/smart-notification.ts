import * as Toastify from 'toastify-js';

export class SmartNotification {
  toaster = (config: {[param: string]: any}) => {
    Toastify({
      // text: message,
      // duration: duration ?? 2000,
      ...config,
      backgroundColor: "linear-gradient(315deg, #7f53ac 0%, #647dee 74%)"
    }).showToast();
  };
}
