export default (timeout: number) =>
  new Promise((resolve) => {
    if (timeout <= 0) {
      resolve('');
    } else {
      setTimeout(() => {
        resolve('');
      }, timeout);
    }
  });
