import type { ErrorsProps } from "~/components/input/Errors.vue";
import type { InputProps } from "~/components/input/Input.vue";
import type { LabelProps } from "~/components/input/Label.vue";

export interface InputArgs {
  gridArea?: string;
  initial?: string | number | undefined;
  maxlength?: number;
  required?: boolean;
}

export default function useInput(id: string, args: InputArgs = {}) {
  const clientError = shallowRef<string>();
  const serverErrors = ref<string[]>([]);
  const value = shallowRef<string | number | undefined>(args.initial);
  const valueAtValidation = shallowRef<string | number>();

  const canSubmit = computed(() => (!args.required || length.value > 0) && !overflow.value && !hasErrors.value);
  const hasErrors = computed(() => errors.value.length > 0);
  const length = computed<number>(() => valueAsString.value.length);
  const overflow = computed(() => args.maxlength !== undefined && length.value > args.maxlength);
  const valueAsString = computed(() => (value.value ? String(value.value) : ""));

  const errors = computed<string[]>(() => {
    const _errors = valueAtValidation.value === value.value ? serverErrors.value : [];
    if (clientError.value) _errors.push(clientError.value);
    return _errors;
  });

  const errorsProps = computed<ErrorsProps>(() => ({
    errors: errors.value,
    gridArea: args.gridArea ? `${args.gridArea}-errors` : undefined,
  }));

  const labelProps = computed<LabelProps>(() => ({
    for: id,
    gridArea: args.gridArea ? `${args.gridArea}-label` : undefined,
    length: length.value,
    maxlength: args.maxlength,
  }));

  const props = computed<InputProps>(() => ({
    gridArea: args.gridArea,
    hasErrors: hasErrors.value,
    id,
    maxlength: args.maxlength,
    required: args.required,
    setClientValidationMessage,
  }));

  const valueAsNumber = computed<number>(() => {
    if (typeof value.value === "number") return value.value;
    if (typeof value.value === "string") return Number.parseFloat(value.value);
    return NaN;
  });

  function setClientValidationMessage(message: string) {
    clientError.value = message || undefined;
  }

  function setServerErrors(errors: string[]) {
    valueAtValidation.value = value.value;
    serverErrors.value = errors;
  }

  return {
    canSubmit,
    errorsProps,
    hasErrors,
    id,
    labelProps,
    props,
    setServerErrors,
    value,
    valueAsNumber,
    valueAsString,
  };
}
