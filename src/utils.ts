function toURL(params: any): string {
  const temp = [];
  for (let k in params) {
    temp.push(k + '=' + encodeURIComponent(params[k]));
  }
  return '?' + temp.join('&');
}

export { toURL };
