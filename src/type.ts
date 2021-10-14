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

export {
  HttpError,
  HttpHeader,
  HttpConfig,
  HttpResponse,
  HttpContentType,
  AfterResponseCallBack,
  BeforeRequestCallBack,
};
