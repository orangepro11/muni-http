# 使用示例

```
import { HttpRequest, createGetHook, createPostHook, HttpContentType } from 'muni-http'

const baseURL = 'https://test.icu/api/'

const http = new HttpRequest().setBaseURL(baseURL).setContentType(HttpContentType.form)

export const get = createGetHook(http)

export const post = createPostHook(http)

export { http }
```
