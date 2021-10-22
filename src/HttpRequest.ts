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
   * 构造函数的替代方案
   * @author 不爱喝橙子汁
   * @static
   * @memberof HttpRequest
   */
  static create(): HttpRequest {
    return new HttpRequest();
  }

  /**
   * 获取当前的所有实例
   * @author 不爱喝橙子汁
   * @static
   * @memberof HttpRequest
   */
  static getInstances(): HttpRequest[] {
    return HttpRequest.instances;
  }

  /**
   * 获取请求的url地址
   * @author 不爱喝橙子汁
   */
  public getRequestUrl(): RequestInfo {
    return this.requestUrl;
  }

  /**
   * 获取作为选项部分的参数
   * @author 不爱喝橙子汁
   */
  public getRequestOptions(): HttpConfig | undefined {
    return this.requestOptions;
  }

  /**
   * 获取请求的url+选项
   * @author 不爱喝橙子汁
   */
  public getRequestInfo(): {
    url: RequestInfo;
    options: HttpConfig | undefined;
  } {
    return {
      url: this.requestUrl,
      options: this.requestOptions,
    };
  }

  /**
   * 设置请求头
   * @author 不爱喝橙子汁
   */
  public setHeaders(val: HttpHeader): HttpRequest {
    this.headers = val;
    return this;
  }

  /**
   * 获取请求头
   * @author 不爱喝橙子汁
   */
  public getHeaders(): HttpHeader {
    return this.headers;
  }

  /**
   * 设置content-type，例如HttpContentType.form / HttpContentType.json
   * 目前版本只支持这两种方式
   * @author 不爱喝橙子汁
   */
  public setContentType(val: HttpContentType): HttpRequest {
    this.headers['Content-Type'] = val;
    return this;
  }

  /**
   * 获取content-type
   * @author 不爱喝橙子汁
   */
  public getContentType(): HttpContentType {
    return this.headers['Content-Type'] as HttpContentType;
  }

  /**
   * 设置以Bearer 为前缀的token
   * @author 不爱喝橙子汁
   */
  public setBearerToken(val: string): HttpRequest {
    const token = 'Bearer ' + val;
    this.headers.Authorization = token;
    return this;
  }

  /**
   * 设置通用的token
   * @author 不爱喝橙子汁
   */
  public setToken(val: string): HttpRequest {
    this.headers.Authorization = val;
    return this;
  }

  /**
   * 获取当前设置的token
   * @author 不爱喝橙子汁
   */
  public getToken(): string | undefined {
    return this.headers.Authorization;
  }

  /**
   * 设置请求的基础路径
   * @author 不爱喝橙子汁
   */
  public setBaseURL(val: string): HttpRequest {
    this.baseURL = val;
    return this;
  }

  /**
   * 获取请求的基础路径
   * @author 不爱喝橙子汁
   */
  public getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * 清空当前设置的content-type
   * @author 不爱喝橙子汁
   */
  public clearContentType(): HttpRequest {
    this.headers['Content-Type'] = '';
    return this;
  }

  /**
   * 清空当前设置的token
   * @author 不爱喝橙子汁
   */
  public clearToken(): HttpRequest {
    this.headers.Authorization = '';
    return this;
  }

  /**
   * 清空当前设置的基础路径
   * @author 不爱喝橙子汁
   */
  public clearBaseURL(): HttpRequest {
    this.baseURL = '';
    return this;
  }

  /**
   * 清空全部设置
   * @author 不爱喝橙子汁
   */
  public reset(): HttpRequest {
    this.baseURL = '';
    this.headers = {};
    return this;
  }

  /**
   * 组合生成fetch的选项参数
   * @author 不爱喝橙子汁
   */
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

  public get(url: RequestInfo, params?: any): Promise<any> {
    return this.sendRequest(url + '?' + toURL(params));
  }

  public post(url: RequestInfo, body?: any): Promise<any> {
    let data = body;
    if (this.headers['Content-Type'] == HttpContentType.form) {
      data = toURL(body);
    } else if (this.headers['Content-Type'] == HttpContentType.json) {
      data = JSON.stringify(body);
    }
    return this.sendRequest(url, {
      method: 'POST',
      body: data,
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
