import { ref, computed, type Ref, type ComputedRef } from "vue";

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | undefined;
  message?: string;
}

interface FormValidationOptions {
  mode?: "blur" | "change" | "submit";
}

export function useFormValidation<T>(
  schema: Record<keyof T, ValidationRule>,
  formData: Ref<T>,
  options?: FormValidationOptions,
) {
  const mode = options?.mode ?? "blur";
  const errors = ref<Partial<Record<keyof T, string>>>({});
  const touched = ref<Partial<Record<keyof T, boolean>>>({});

  type ValidatorFn = (
    value: any,
    rules: ValidationRule,
    field: keyof T,
  ) => string | undefined;

  const validators: ValidatorFn[] = [
    function requiredValidator(value, rules, field) {
      if (
        rules.required &&
        (value === null || value === undefined || value === "")
      ) {
        return rules.message ?? `${String(field)} is required`;
      }
    },
    function minLengthValidator(value, rules, field) {
      if (rules.minLength && value && String(value).length < rules.minLength) {
        return (
          rules.message ??
          `${String(field)} must be at least ${rules.minLength} characters`
        );
      }
    },
    function maxLengthValidator(value, rules, field) {
      if (rules.maxLength && value && String(value).length > rules.maxLength) {
        return (
          rules.message ??
          `${String(field)} must be at most ${rules.maxLength} characters`
        );
      }
    },
    function patternValidator(value, rules, field) {
      if (rules.pattern && value && !rules.pattern.test(String(value))) {
        return rules.message ?? `${String(field)} has invalid format`;
      }
    },
    function minValidator(value, rules, field) {
      if (rules.min !== undefined && Number(value) < rules.min) {
        return (
          rules.message ?? `${String(field)} must be at least ${rules.min}`
        );
      }
    },
    function maxValidator(value, rules, field) {
      if (rules.max !== undefined && Number(value) > rules.max) {
        return rules.message ?? `${String(field)} must be at most ${rules.max}`;
      }
    },
    function customValidator(value, rules) {
      if (rules.custom && value) {
        return rules.custom(value);
      }
    },
  ];

  function validateField(field: keyof T): void {
    const value = formData.value[field];
    const rules = schema[field];

    if (!rules) {
      delete errors.value[field];
      return;
    }

    const errorMessage = validators
      .map((validator) => validator(value, rules, field))
      .find((error) => error !== undefined);

    if (errorMessage) {
      errors.value[field] = errorMessage;
    } else {
      delete errors.value[field];
    }
  }

  function validateAll(): boolean {
    const fields = Object.keys(schema) as Array<keyof T>;
    fields.forEach((field) => {
      touched.value[field] = true;
      validateField(field);
    });
    return Object.keys(errors.value).length === 0;
  }

  function clearErrors(): void {
    errors.value = {};
  }

  function clearFieldError(field: keyof T): void {
    delete errors.value[field];
  }

  function reset(): void {
    errors.value = {};
    touched.value = {};
  }

  function handleBlur(field: keyof T): void {
    touched.value[field] = true;
    if (mode === "blur" || mode === "submit") {
      validateField(field);
    }
  }

  function handleChange(field: keyof T): void {
    if (mode === "change" && touched.value[field]) {
      validateField(field);
    } else if (mode === "submit") {
      clearFieldError(field);
    }
  }

  function hasError(field: keyof T): ComputedRef<boolean> {
    return computed(() => !!(touched.value[field] && errors.value[field]));
  }

  function getError(field: keyof T): ComputedRef<string | undefined> {
    return computed(() => errors.value[field]);
  }

  const isValid = computed(() => Object.keys(errors.value).length === 0);

  return {
    errors,
    touched,
    isValid,
    validateField,
    validateAll,
    clearErrors,
    clearFieldError,
    reset,
    handleBlur,
    handleChange,
    hasError,
    getError,
  };
}
