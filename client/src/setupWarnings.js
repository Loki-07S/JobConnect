// Suppress console warnings in development
if (process.env.NODE_ENV === 'development') {
  // Comment out the next line if you want to see warnings again
  // Keep errors visible to not hide real issues
  // eslint-disable-next-line no-console
  console.warn = () => {};
}
