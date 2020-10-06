export async function promisify(method: (...params: any[]) => Promise<any> | void, ...params: any[]) {
  return new Promise((resolve, reject) => {
    method(...params, (err, result) => {
      if(err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
}
