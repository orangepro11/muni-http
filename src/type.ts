import { HttpRequest } from './HttpRequest';

class HttpError extends Error {
  constructor(public code: number, public message: string) {
    super(message);
  }
}

interface HttpHeader {
  'Content-Type'?: string;
  Authorization?: string;
}

interface HttpConfig extends RequestInit {
  important?: Boolean;
  params?: any;
  absoluteUrl?: RequestInfo;
}

interface HttpResponse {
  code: number;
  data: any;
  status: number;
  msg: string;
}

enum HttpContentType {
  json = 'application/json; charset=utf-8',
  form = 'application/x-www-form-urlencoded; charset=utf-8',
}

interface BeforeRequestCallBack {
  (request: HttpRequest): void;
}

interface AfterResponseCallBack {
  (response?: any): void;
}

interface AfterParseResponseCallBack {
  (res: HttpResponse): void;
}

const enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  UnAuthorized = 401,
  ForBidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  URITooLong = 414,
  UnsupportedMediaType = 415,
  CsrfError = 419,
  TooManyRequests = 429,
  InternalServerError = 500,
  BadGateway = 502,
  HttpVersionNotSupported = 505,
}

const enum HttpStatusText {
  OK = '请求成功',
  BadRequest = '无法理解的请求',
  UnAuthorized = '缺少认证凭据',
  ForBidden = '服务器拒绝授权',
  NotFound = '无法找到请求的资源',
  MethodNotAllowed = '请求方法被禁用',
  URITooLong = 'URI过长',
  UnsupportedMediaType = '有效内容格式不受支持',
  CsrfError = 'CSRF验证失败',
  TooManyRequests = '请求速度过快',
  InternalServerError = '服务器意外出错',
  BadGateway = '来自网关的无效响应',
  HttpVersionNotSupported = '不受支持的HTTP版本',
}

type fileURL = string;

interface HookFunction {
  (
    url: RequestInfo,
    payload?: any,
    beforeRequest?: Function,
    afterResponse?: Function
  ): Promise<any>;
}

export {
  HttpError,
  HttpHeader,
  HttpConfig,
  HttpResponse,
  HttpContentType,
  AfterResponseCallBack,
  BeforeRequestCallBack,
  AfterParseResponseCallBack,
  HttpStatus,
  HttpStatusText,
  fileURL,
  HookFunction,
};
