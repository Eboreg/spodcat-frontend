function useTextInput(initialValue?: MaybeRefOrGetter<string>) {
  const _validatedValue = ref<string | undefined>(undefined);
  const _validationErrors = ref<string[]>([]);
  const value = ref<string>(toValue(initialValue) ?? "");

  const validationErrors = computed(() =>
    _validatedValue.value === value.value ? _validationErrors.value : [],
  );

  function setValidationErrors(errors: string[]) {
    _validatedValue.value = value.value;
    _validationErrors.value = errors;
  }

  return { value, validationErrors, setValidationErrors };
}

export default function useTextInputs<Id extends string>(...ids: Id[]) {
  const _textInputs = new Map(ids.map((id) => [id, useTextInput()]));
  const hasErrors = computed(
    () =>
      _textInputs
        .values()
        .flatMap((textInput) => textInput.validationErrors.value)
        .toArray().length > 0,
  );

  function getValidationErrors(id: Id): globalThis.ComputedRef<string[]> {
    return _textInputs.get(id)!.validationErrors;
  }

  function getValue(id: Id): globalThis.Ref<string, string> {
    return _textInputs.get(id)!.value;
  }

  function setValidationErrors(value: Partial<Record<Id, string[]>>) {
    _textInputs.forEach((textInput, id) => {
      textInput.setValidationErrors(value[id] ?? []);
    });
  }

  return { getValidationErrors, getValue, hasErrors, setValidationErrors };
}
