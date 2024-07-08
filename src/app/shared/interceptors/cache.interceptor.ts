import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

const cacheMap = new Map<string, any>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // console.log(cacheMap);
  if (req.method !== 'GET') {
    console.log("cacheInterceptor");
    return next(req);
  }

  const cachedResponse = cacheMap.get(req.urlWithParams);
  if (cachedResponse) {
    // Check if cached response is valid
    if (isCacheValid(cachedResponse)) {
      // console.log(`Cached response: ${cachedResponse}`);
      return of(cachedResponse);
    } else {
      cacheMap.delete(req.urlWithParams);
    }
  }

  return next(req).pipe(
    tap(response => {
      if (response instanceof HttpResponse) {
        // console.log("cache set");
        cacheMap.set(req.urlWithParams, response);
      }
    })
  );
};

function isCacheValid(cachedResponse: HttpResponse<any>) {
  // Implement logic to check cache validity based on your requirements
  // This could involve checking for expiration timestamps or tags
  // in the response headers. For example:
  const expirationTimestamp = cachedResponse.headers.get('cache-control');
  return expirationTimestamp && Date.now() < +expirationTimestamp;
}