# React Lazy
Lazy components that dynamically load on mount. 

### Installation 
```bash
npm i -S @figliolia/react-lazy
#or
yarn add @figliolia/react-lazy
```

### Basic Usage
```tsx
import type { ErrorInfo } from "react";
import { CreateLazyComponent } from "@figliolia/react-lazy";

const MyLazyComponent = CreateLazyComponent({
  fallback: <div>Loading</div>, 
  errorBoundary: <div>Whoops!</div>,
  loader: () => import("./path/to/Component"),
  onError: (error: Error, errorInfo: ErrorInfo) => {}
});

// Optionally Preload your component using:
void MyLazyComponent.preload()

// Render your component without preloading and it'll
// load on mount
export const MyApp () => {
  return (
    <main>
      <MyLazyComponent {...lazyComponentProps} />
      {/* your other component markup */}
    </main>
  );
}
```

## CreateLazyComponent()
### Parameters
`loader`: An async function that resolves to `{ default: ComponentType<T> }`. This function is passed to `React.lazy()`.

`fallback`: (optional) A `ReactNode` to display while to the lazy component is suspended

`errorBoundary`: (optional) A `ReactNode` to display if the lazy component throws an error

`onError`: (optional) A callback to execute if the lazy component throws an error.

### Returns
A `LazyComponent` instance

## Advanced Usage - Preloading
This feature is an additional optimization that allows you to optimistically load dynamic components ahead of when they're actually needed.

Consider a case where you have a user logging into your application for the first time. When they press your login button, you'll probably send a request to your server to validate the user's credentials - then, if they are valid, you'll redirect the user into your app.

While the credentials are being sent to the server, it may also be prudent to *securely* `preload` some of the components that are sitting behind your authentication. A working example may look something like the following:

```tsx
import { useRef, useCallback } from "react";
import { LazyHeader, LazyContent, LazyFooter } from "./your-app-components";

export const LoginScreen = () => {
  const preloaded = useRef(false);

  const preloadComponents = useCallback(async () => {
    if(preloaded.current) {
      return;
    }
    try {
      await Promise.all([
        LazyHeader.preload(),
        LazyContent.preload(),
        LazyFooter.preload(),
      ]);
      preloaded.current = true;
    } catch() {
      // silence
    }
  }, [preloaded])

  const onSubmit = useCallback(async () => {
    void preloadComponents();
    try {
      await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify(/* Login Credentials */)
      });
      redirect("to/your/app");
    } catch(e) {
      // handle error
    }
  }, [preloadComponents]);

  return (
    <form onSubmit={onSubmit}>
      {/* login inputs */}
      <button type="submit" value="Login" />
    </form>
  );
}
```
Using this technique, we can utilize the time that an API request is already in-flight to cache component assets in the browser. This way when authentication completes the redirect to our main application content is instantaneous.