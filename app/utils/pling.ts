function makeBackendUrl(path: string): string {
  if (/^https?:\/\/.*/.test(path)) return path;
  const runtimeConfig = useRuntimeConfig();
  return new URL(path, runtimeConfig.public.backendHost).toString();
}

export default function (path: string) {
  if (import.meta.client) {
    callOnce(() => navigator.sendBeacon(makeBackendUrl(path)), { mode: "navigation" });
  }
}
