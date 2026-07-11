import type { H3Event } from "h3";

export default function (path: string, event?: H3Event<EventHandlerRequest>): string {
  if (/^https?:\/\/.*/.test(path)) return path;
  const runtimeConfig = useRuntimeConfig(event);
  return new URL(path, runtimeConfig.public.backendHost).toString();
}
