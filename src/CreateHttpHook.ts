import { HttpRequest } from './HttpRequest';
import {
  fileURL,
  HookFunction,
  BeforeRequestCallBack,
  AfterResponseCallBack,
  AfterParseResponseCallBack,
} from './type';
export function createGetHook(_http: HttpRequest): HookFunction {
  const http: HttpRequest = _http;
  return async (
    url: RequestInfo,
    params?: any,
    beforeRequest?: Function,
    afterResponse?: Function
  ) => {
    beforeRequest && beforeRequest();
    const res = http.get(url, params);
    afterResponse && afterResponse();
    return res;
  };
}

export function createPostHook(_http: HttpRequest): HookFunction {
  const http: HttpRequest = _http;
  return async (
    url: RequestInfo,
    body?: any,
    beforeRequest?: Function,
    afterResponse?: Function
  ) => {
    beforeRequest && beforeRequest();
    const res = http.post(url, body);
    afterResponse && afterResponse();
    return res;
  };
}

export function createUploadFileHook(
  _http: HttpRequest,
  url: RequestInfo,
  token: string
): (
  file: File,
  beforeRequest?: Function,
  afterResponse?: Function
) => Promise<fileURL> {
  const http: HttpRequest = _http;
  return async (
    file: File,
    beforeRequest?: Function,
    afterResponse?: Function
  ): Promise<fileURL> => {
    beforeRequest && beforeRequest();
    const res = await http.upload(url, {
      token,
      file,
    });
    afterResponse && afterResponse();
    return res;
  };
}

/**
 *
 * 在发送请求前为每一个实例加上钩子
 * @author 不爱喝橙子汁
 * @export
 * @param callback
 */
export function onBeforeRequest(callback: BeforeRequestCallBack) {
  const instances: HttpRequest[] = HttpRequest.getInstances();
  instances.forEach(instance => {
    instance.beforeRequest(callback);
  });
}

/**
 * 在发送请求后解析数据前为每一个实例加上钩子
 * @author 不爱喝橙子汁
 * @export
 * @param callback
 */
export function onAfterResponse(callback: AfterResponseCallBack) {
  const instances: HttpRequest[] = HttpRequest.getInstances();
  instances.forEach(instance => {
    instance.afterResponse(callback);
  });
}

/**
 *
 * 在解析数据后为一个实例加上钩子
 * @author 不爱喝橙子汁
 * @export
 * @param callback
 */
export function onAfterParseResponse(callback: AfterParseResponseCallBack) {
  const instances: HttpRequest[] = HttpRequest.getInstances();
  instances.forEach(instance => {
    instance.afterParseResponse(callback);
  });
}
