declare global {
  namespace jest {
    interface Matchers<R> {
      toRedirectTo(location: string, expectedStatusCode?: number): R;
    }
  }
}

export {};