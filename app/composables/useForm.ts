import type { Reactive } from "vue";
import type { InputArgs } from "./useInput";
import useInput from "./useInput";

export default function useForm() {
  const inputs = ref<ReturnType<typeof useInput>[]>([]);

  const canSubmit = computed(() => inputs.value.every((input) => input.canSubmit));

  function addInput(id: string, args?: InputArgs): Reactive<ReturnType<typeof useInput>> {
    const input = reactive(useInput(id, args));
    inputs.value.push(input);
    return input;
  }

  function reset() {
    inputs.value.forEach((input) => {
      input.value = "";
      input.setServerErrors([]);
    });
  }

  function setServerErrors(errors: Record<string, string[]>) {
    inputs.value.forEach((input) => input.setServerErrors(errors[input.id] ?? []));
  }

  return { canSubmit, addInput, reset, setServerErrors };
}
