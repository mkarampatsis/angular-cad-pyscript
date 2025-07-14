import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PyscriptLoaderService {

  loadMoment = false;

  loadPyScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).pyscript) return resolve();

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://pyscript.net/releases/2025.7.3/core.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://pyscript.net/releases/2025.7.3/core.js';
      script.type = "module"
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject('PyScript failed to load');
      document.head.appendChild(script);
    });
  }
}
