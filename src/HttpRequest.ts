import {
  HttpError,
  HttpHeader,
  HttpConfig,
  HttpResponse,
  HttpContentType,
  AfterResponseCallBack,
  BeforeRequestCallBack,
} from './type';
import { toURL } from './utils';
class HttpRequest {
  private baseURL = '';
  private headers: HttpHeader = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  };
  private RequestCallback: BeforeRequestCallBack | undefined;
  private ResponseCallback: AfterResponseCallBack | undefined;
  private requestUrl: RequestInfo = '';
  private requestOptions: HttpConfig | undefined;

  constructor() {}

  static create(): HttpRequest {
    return new HttpRequest();
  }

  public getRequestUrl(): RequestInfo {
    return this.requestUrl;
  }

  public getRequestOptions(): HttpConfig | undefined {
    return this.requestOptions;
  }

  public getRequestInfo() {
    return {
      url: this.requestUrl,
      options: this.requestOptions,
    };
  }

  public setHeaders(val: HttpHeader) {
    this.headers = val;
    return this;
  }

  public setContentType(val: HttpContentType) {
    this.headers['Content-Type'] = val;
    return this;
  }

  public setBearerToken(val: string) {
    const token = 'Bearer ' + val;
    this.headers.Authorization = token;
    return this;
  }

  public setBaseURL(val: string) {
    this.baseURL = val;
    return this;
  }

  public sendRequest = async (
    url: RequestInfo,
    options?: HttpConfig
  ): Promise<any> => {
    this.requestUrl = url;
    this.requestOptions = options;
    this.RequestCallback && this.RequestCallback(this);
    let response = null;
    let config: HttpConfig = {
      headers: this.headers as HeadersInit,
    };
    if (options && options.important) {
      if (options.absoluteUrl === '') {
        response = await fetch(this.baseURL + url, options);
      } else {
        response = await fetch(options.absoluteUrl as RequestInfo, options);
      }
    } else {
      response = await fetch(this.baseURL + url, { ...config, ...options });
    }
    this.ResponseCallback && this.ResponseCallback(response);
    if (!response) {
      throw new Error('网络异常');
    }
    if (response.status == 404) {
      throw new Error('url不存在');
    }
    if (response.status == 401) {
      throw new Error('未登录');
    }
    if (response.status == 500) {
      throw new Error('服务器异常');
    }
    if (!response.ok) {
      throw new Error('未知错误');
    }
    const res: HttpResponse = await response.json();

    if (res.status != 1) {
      throw new HttpError(res.code, res.msg);
    }
    return res.data;
  };

  public beforeRequest(callback: BeforeRequestCallBack) {
    this.RequestCallback = callback;
    return this;
  }

  public afterResponse(callback: AfterResponseCallBack) {
    this.ResponseCallback = callback;
    return this;
  }

  public get(url: RequestInfo, params?: any): Promise<any> {
    return this.sendRequest(url + toURL(params));
  }

  public post(url: RequestInfo, body?: any): Promise<any> {
    return this.sendRequest(url, {
      method: 'POST',
      body,
    });
  }
}

export { HttpRequest };

export default HttpRequest;
