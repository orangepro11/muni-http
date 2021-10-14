import {
  HttpError,
  HttpHeader,
  HttpConfig,
  HttpResponse,
  HttpContentType,
  AfterResponseCallBack,
  BeforeRequestCallBack,
  AfterParseResponseCallBack,
} from './type';
import { toURL, validateResponse } from './utils';
class HttpRequest {
  private baseURL = '';
  private headers: HttpHeader = {};
  private RequestCallback: BeforeRequestCallBack | undefined;
  private ResponseCallback: AfterResponseCallBack | undefined;
  private requestUrl: RequestInfo = '';
  private requestOptions: HttpConfig | undefined;
  private parseResponseCallback: AfterParseResponseCallBack | undefined;
  private static instances: HttpRequest[] = [];

  /**
   * Creates an instance of HttpRequest. registe it
   * @author 不爱喝橙子汁
   * @memberof HttpRequest
   */
  constructor() {
    HttpRequest.instances.push(this);
  }

  /**
   *
   * alias of constructor
   * @author 不爱喝橙子汁
   * @static
   * @return {*}
   * @memberof HttpRequest
   */
  static create(): HttpRequest {
    return new HttpRequest();
  }

  /**
   *
   * get All Instance
   * @author 不爱喝橙子汁
   * @static
   * @return {*}
   * @memberof HttpRequest
   */
  static getInstances(): HttpRequest[] {
    return HttpRequest.instances;
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

  public getHeaders(): HttpHeader {
    return this.headers;
  }

  public setContentType(val: HttpContentType): HttpRequest {
    this.headers['Content-Type'] = val;
    return this;
  }

  public getContentType(): HttpContentType {
    return this.headers['Content-Type'] as HttpContentType;
  }

  public setBearerToken(val: string): HttpRequest {
    const token = 'Bearer ' + val;
    this.headers.Authorization = token;
    return this;
  }

  public setToken(val: string): HttpRequest {
    this.headers.Authorization = val;
    return this;
  }

  public getToken(): string | undefined {
    return this.headers.Authorization;
  }

  public setBaseURL(val: string): HttpRequest {
    this.baseURL = val;
    return this;
  }

  public getBaseURL() {
    return this.baseURL;
  }

  public clearContentType(): HttpRequest {
    this.headers['Content-Type'] = '';
    return this;
  }

  public clearToken(): HttpRequest {
    this.headers.Authorization = '';
    return this;
  }

  public clearBaseURL(): HttpRequest {
    this.baseURL = '';
    return this;
  }

  public reset(): HttpRequest {
    this.baseURL = '';
    this.headers = {};
    return this;
  }

  private generateConfig(options: HttpConfig = {}) {
    let config: HttpConfig = {
      headers: this.headers as HeadersInit,
    };
    if (options && options.important) {
      config = options;
    } else {
      config = { ...config, ...options };
    }
    return config;
  }

  public sendRequest = async (
    url: RequestInfo,
    options?: HttpConfig
  ): Promise<any> => {
    this.requestUrl = url;
    const config = this.generateConfig(options);
    this.requestOptions = config;
    this.RequestCallback && this.RequestCallback(this);
    const response: Response = await fetch(this.baseURL + url, config);
    this.ResponseCallback && this.ResponseCallback(response);
    validateResponse(response);
    const res: HttpResponse = await response.json();
    this.parseResponseCallback && this.parseResponseCallback(res);
    if (res.status != 1) {
      throw new HttpError(res.code, res.msg);
    }
    return res.data;
  };

  public beforeRequest(callback: BeforeRequestCallBack | undefined) {
    this.RequestCallback = callback;
    return this;
  }

  public afterResponse(callback: AfterResponseCallBack | undefined) {
    this.ResponseCallback = callback;
    return this;
  }

  public afterParseResponse(callback: AfterParseResponseCallBack) {
    this.parseResponseCallback = callback;
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

  public async upload(url: RequestInfo, body?: any): Promise<any> {
    const form = new FormData();
    form.append('file', body.file);
    form.append('token', body.token);
    const { url: fileUrl, key } = await this.sendRequest(url, {
      method: 'POST',
      body: form,
    });
    return fileUrl + key;
  }
}

export { HttpRequest };

export default HttpRequest;
