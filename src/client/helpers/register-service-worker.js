if (__PRODUCTION__) {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.info('Service worker registered!');
      })
      .catch((error) => {
        console.error('Error registering service worker: ', error);
      });
  }
  else {
    console.warn('ServiceWorker is not supported by browser');
  }
}
