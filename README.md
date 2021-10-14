# 安装

## 使用 npm

```
npm install --save muni-http
```

## 使用 yarn

```
yarn add muni-http
```

## 使用pnpm

```
pnpm install --save muni-http
```

# 使用示例

```typescript
import {
  HttpRequest,
  createGetHook,
  createPostHook,
  HttpContentType,
} from 'muni-http';

const baseURL = 'https://test.icu/api/';

const http = new HttpRequest()
  .setBaseURL(baseURL)
  .setContentType(HttpContentType.form);

export const get = createGetHook(http);

export const post = createPostHook(http);

export { http };
```



# API

## HttpRequest

用来定义发http请求的基础类。

```typescript
import {HttpRequest} from 'muni-http'

const http = new HttpRequest().setBaseURL('http://test.api/api').setContentType(HttpContentType.form)

http.get('v1/books/get_book_info', {id: 1});

http.post('v1/books/create_book', {
  name: ''
});
```



### create()

构造函数的替代写法



#### getRequestUrl()

获取当前请求的url，在beforeRequest的时候能拿到



### getRequestOptions()

获取当前请求使用的配置





## createGetHook

这是一个创建get钩子的函数，内部通过closure保存传入的HttpRequest实例。

```typescript
const get = createGetHook(http)
```



## createPostHook

这是一个创建post钩子的函数，内部通过closure保存传入的HttpRequest实例。

```typescript
const post = createPostHook(http)
```



### HttpContentType

有两种选择：json 或者 form

```typescript
enum HttpContentType {
    json = "application/json; charset=utf-8",
    form = "application/x-www-form-urlencoded; charset=utf-8"
}
```





# Hooks

## get

### 函数声明

```typescript
(
  url: RequestInfo, 
  params?: any, 
  beforeRequest?: BeforeRequestCallBack | undefined, 
  afterResponse?: AfterResponseCallBack | undefined
) => Promise<any>
```



### 使用

```typescript
get('v1/books/get_book_info', {id: 1}, ()=>console.log('请求中...'))
```



## post

### 函数声明

```typescript
(
  url: RequestInfo, 
  body?: any, 
  beforeRequest?: BeforeRequestCallBack | undefined, 
  afterResponse?: AfterResponseCallBack | undefined
) => Promise<any>
```



### 使用

```typescript
post('v1/books/create_book', {name: 'hello'}, (req)=>console.log(req.getRequestInfo()))
```



