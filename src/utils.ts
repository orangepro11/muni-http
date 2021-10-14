import { HttpStatus, HttpStatusText } from './type';
export function toURL(params: any): string {
  const temp = [];
  for (let k in params) {
    temp.push(k + '=' + encodeURIComponent(params[k]));
  }
  return '?' + temp.join('&');
}

export function validateResponse(response: Response) {
  if (!response) {
    throw new Error('网络异常');
  }
  if (response.status == HttpStatus.NotFound) {
    throw new Error(HttpStatusText.NotFound);
  }
  if (response.status == HttpStatus.BadRequest) {
    throw new Error(HttpStatusText.BadRequest);
  }
  if (response.status == HttpStatus.UnAuthorized) {
    throw new Error(HttpStatusText.UnAuthorized);
  }
  if (response.status == HttpStatus.InternalServerError) {
    throw new Error(HttpStatusText.InternalServerError);
  }
  if (response.status == HttpStatus.CsrfError) {
    throw new Error(HttpStatusText.CsrfError);
  }
  if (response.status == HttpStatus.MethodNotAllowed) {
    throw new Error(HttpStatusText.MethodNotAllowed);
  }
  if (response.status == HttpStatus.BadGateway) {
    throw new Error(HttpStatusText.BadGateway);
  }
  if (response.status == HttpStatus.TooManyRequests) {
    throw new Error(HttpStatusText.TooManyRequests);
  }
  if (response.status == HttpStatus.HttpVersionNotSupported) {
    throw new Error(HttpStatusText.HttpVersionNotSupported);
  }
  if (!response.ok) {
    throw new Error('未知错误');
  }
}
