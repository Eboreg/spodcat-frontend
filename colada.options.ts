import type { PiniaColadaOptions } from "@pinia/colada";

export default {
  queryOptions: {
    staleTime: 1000 * 60 * 60, // 1 hour
  },
} satisfies PiniaColadaOptions;
