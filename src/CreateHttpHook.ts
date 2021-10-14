import { HttpRequest } from './HttpRequest';
function createGetHook(_http: HttpRequest) {
  const http: HttpRequest = _http;
  return (
    url: RequestInfo,
    params?: any,
    beforeRequest?: any,
    afterResponse?: any
  ) => {
    http.beforeRequest(beforeRequest);
    http.afterResponse(afterResponse);
    return http.get(url, params);
  };
}

function createPostHook(_http: HttpRequest) {
  const http: HttpRequest = _http;
  return (url: RequestInfo, body?: any) => {
    return http.post(url, body);
  };
}

export { createGetHook, createPostHook };
