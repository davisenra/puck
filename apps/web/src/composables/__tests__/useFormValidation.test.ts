import { describe, test, expect } from "vitest";
import { ref } from "vue";
import { useFormValidation } from "../useFormValidation";

describe("useFormValidation", () => {
  describe("validation rules", () => {
    test("required validation - rejects empty string", () => {
      const formData = ref({ username: "" });
      const schema = { username: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("username");
      expect(getError("username").value).toBe("username is required");
    });

    test("required validation - rejects null", () => {
      const formData = ref({ email: null });
      const schema = { email: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("email");
      expect(getError("email").value).toBe("email is required");
    });

    test("required validation - rejects undefined", () => {
      const formData = ref<{ field: string }>({ field: undefined as any });
      const schema = { field: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBe("field is required");
    });

    test("required validation - accepts non-empty string", () => {
      const formData = ref({ username: "john" });
      const schema = { username: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("username");
      expect(getError("username").value).toBeUndefined();
    });

    test("required validation - accepts zero number", () => {
      const formData = ref({ count: 0 });
      const schema = { count: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("count");
      expect(getError("count").value).toBeUndefined();
    });

    test("required validation - accepts non-zero number", () => {
      const formData = ref({ count: 5 });
      const schema = { count: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("count");
      expect(getError("count").value).toBeUndefined();
    });

    test("required validation - rejects empty string", () => {
      const formData = ref({ count: "" });
      const schema = { count: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("count");
      expect(getError("count").value).toBe("count is required");
    });

    test("minLength validation - rejects string too short", () => {
      const formData = ref({ password: "ab" });
      const schema = { password: { minLength: 5 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("password");
      expect(getError("password").value).toBe(
        "password must be at least 5 characters",
      );
    });

    test("minLength validation - accepts string meeting length", () => {
      const formData = ref({ password: "abcdef" });
      const schema = { password: { minLength: 5 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("password");
      expect(getError("password").value).toBeUndefined();
    });

    test("minLength validation - ignores null/undefined", () => {
      const formData = ref({ field: null });
      const schema = { field: { minLength: 5 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBeUndefined();
    });

    test("maxLength validation - rejects string too long", () => {
      const formData = ref({ bio: "This is a very long bio" });
      const schema = { bio: { maxLength: 10 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("bio");
      expect(getError("bio").value).toBe("bio must be at most 10 characters");
    });

    test("maxLength validation - accepts string within limit", () => {
      const formData = ref({ bio: "short bio" });
      const schema = { bio: { maxLength: 10 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("bio");
      expect(getError("bio").value).toBeUndefined();
    });

    test("maxLength validation - ignores null/undefined", () => {
      const formData = ref({ field: null });
      const schema = { field: { maxLength: 10 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBeUndefined();
    });

    test("pattern validation - rejects non-matching value", () => {
      const formData = ref({ email: "invalid-email" });
      const schema = { email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("email");
      expect(getError("email").value).toBe("email has invalid format");
    });

    test("pattern validation - accepts matching value", () => {
      const formData = ref({ email: "test@example.com" });
      const schema = { email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("email");
      expect(getError("email").value).toBeUndefined();
    });

    test("pattern validation - ignores null/undefined", () => {
      const formData = ref({ field: null });
      const schema = { field: { pattern: /^[0-9]+$/ } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBeUndefined();
    });

    test("min validation - rejects number below minimum", () => {
      const formData = ref({ age: "15" });
      const schema = { age: { min: 18 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("age");
      expect(getError("age").value).toBe("age must be at least 18");
    });

    test("min validation - accepts number at minimum", () => {
      const formData = ref({ age: "18" });
      const schema = { age: { min: 18 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("age");
      expect(getError("age").value).toBeUndefined();
    });

    test("min validation - accepts number above minimum", () => {
      const formData = ref({ age: "25" });
      const schema = { age: { min: 18 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("age");
      expect(getError("age").value).toBeUndefined();
    });

    test("max validation - rejects number above maximum", () => {
      const formData = ref({ rating: "6" });
      const schema = { rating: { max: 5 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("rating");
      expect(getError("rating").value).toBe("rating must be at most 5");
    });

    test("max validation - accepts number at maximum", () => {
      const formData = ref({ rating: "5" });
      const schema = { rating: { max: 5 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("rating");
      expect(getError("rating").value).toBeUndefined();
    });

    test("max validation - accepts number below maximum", () => {
      const formData = ref({ rating: "3" });
      const schema = { rating: { max: 5 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("rating");
      expect(getError("rating").value).toBeUndefined();
    });

    test("custom validation - returns custom error", () => {
      const formData = ref({ password: "simple" });
      const schema = {
        password: {
          custom: (value: any) => {
            if (String(value).length < 8) {
              return "Password must be at least 8 characters";
            }
          },
        },
      };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("password");
      expect(getError("password").value).toBe(
        "Password must be at least 8 characters",
      );
    });

    test("custom validation - accepts valid value", () => {
      const formData = ref({ password: "complex123" });
      const schema = {
        password: {
          custom: (value: any) => {
            if (String(value).length < 8) {
              return "Password must be at least 8 characters";
            }
          },
        },
      };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("password");
      expect(getError("password").value).toBeUndefined();
    });

    test("custom validation - ignores null/undefined", () => {
      const formData = ref({ field: null });
      const schema = {
        field: {
          custom: () => "Should not be called",
        },
      };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBeUndefined();
    });

    test("custom error message overrides default message", () => {
      const formData = ref({ username: "" });
      const schema = {
        username: { required: true, message: "Please enter a username" },
      };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("username");
      expect(getError("username").value).toBe("Please enter a username");
    });

    test("multiple rules on single field - all pass", () => {
      const formData = ref({ username: "john123" });
      const schema = {
        username: { required: true, minLength: 3, maxLength: 20 },
      };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("username");
      expect(getError("username").value).toBeUndefined();
    });

    test("multiple rules on single field - fails first failed rule", () => {
      const formData = ref({ username: "" });
      const schema = {
        username: { required: true, minLength: 3 },
      };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("username");
      expect(getError("username").value).toBe("username is required");
    });

    test("field without rules - removes existing error", () => {
      const formData = ref({ name: "John", age: "" });
      const schema = {
        name: { required: true, minLength: 2 },
        age: {},
      };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("name");
      expect(getError("name").value).toBeUndefined();

      validateField("age");
      expect(getError("age").value).toBeUndefined();
    });
  });

  describe("validateField function", () => {
    test("clears error when field becomes valid", () => {
      const formData = ref({ email: "" });
      const schema = { email: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("email");
      expect(getError("email").value).toBeDefined();

      formData.value.email = "test@example.com";
      validateField("email");
      expect(getError("email").value).toBeUndefined();
    });

    test("deletes error from errors object when valid", () => {
      const formData = ref({ field: "valid" });
      const schema = { field: { minLength: 2 } };

      const { validateField, errors } = useFormValidation(schema, formData);

      validateField("field");
      expect(errors.value).toEqual({});
    });
  });

  describe("validateAll function", () => {
    test("validates all fields in schema", () => {
      const formData = ref({ username: "", password: "abc" });
      const schema = {
        username: { required: true, minLength: 2 },
        password: { required: true, minLength: 5 },
      };

      const { validateAll, touched, getError } = useFormValidation(
        schema,
        formData,
      );

      const result = validateAll();

      expect(touched.value.username).toBe(true);
      expect(touched.value.password).toBe(true);
      expect(getError("username").value).toBe("username is required");
      expect(getError("password").value).toBe(
        "password must be at least 5 characters",
      );
      expect(result).toBe(false);
    });

    test("returns true when all fields are valid", () => {
      const formData = ref({ username: "john", password: "abcdef" });
      const schema = {
        username: { required: true, minLength: 2 },
        password: { required: true, minLength: 5 },
      };

      const { validateAll } = useFormValidation(schema, formData);

      const result = validateAll();
      expect(result).toBe(true);
    });

    test("marks all fields as touched", () => {
      const formData = ref({ field1: "", field2: "" });
      const schema = {
        field1: { required: true },
        field2: { required: true },
      };

      const { validateAll, touched } = useFormValidation(schema, formData);

      validateAll();

      expect(touched.value.field1).toBe(true);
      expect(touched.value.field2).toBe(true);
    });
  });

  describe("clearErrors function", () => {
    test("clears all errors", () => {
      const formData = ref({ field1: "", field2: "" });
      const schema = {
        field1: { required: true },
        field2: { required: true },
      };

      const { validateAll, clearErrors, errors } = useFormValidation(
        schema,
        formData,
      );

      validateAll();
      expect(Object.keys(errors.value).length).toBeGreaterThan(0);

      clearErrors();
      expect(Object.keys(errors.value).length).toBe(0);
    });
  });

  describe("clearFieldError function", () => {
    test("clears error for specific field", () => {
      const formData = ref({ field1: "", field2: "" });
      const schema = {
        field1: { required: true },
        field2: { required: true },
      };

      const { validateAll, clearFieldError, getError } = useFormValidation(
        schema,
        formData,
      );

      validateAll();
      expect(getError("field1").value).toBeDefined();

      clearFieldError("field1");
      expect(getError("field1").value).toBeUndefined();
      expect(getError("field2").value).toBeDefined();
    });
  });

  describe("reset function", () => {
    test("clears all errors and touched states", () => {
      const formData = ref({ field1: "", field2: "" });
      const schema = {
        field1: { required: true },
        field2: { required: true },
      };

      const { validateAll, reset, errors, touched, hasError } =
        useFormValidation(schema, formData);

      validateAll();
      expect(Object.keys(errors.value).length).toBeGreaterThan(0);
      expect(hasError("field1").value).toBe(true);

      reset();

      expect(Object.keys(errors.value).length).toBe(0);
      expect(touched.value.field1).toBeUndefined();
      expect(hasError("field1").value).toBe(false);
    });
  });

  describe("handleBlur function", () => {
    test('mode "blur" - validates field and marks as touched', () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { handleBlur, touched, getError } = useFormValidation(
        schema,
        formData,
        {
          mode: "blur",
        },
      );

      handleBlur("field");

      expect(touched.value.field).toBe(true);
      expect(getError("field").value).toBe("field is required");
    });

    test('mode "blur" - does not validate on change', () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { handleChange, getError } = useFormValidation(schema, formData, {
        mode: "blur",
      });

      handleChange("field");
      expect(getError("field").value).toBeUndefined();
    });

    test('mode "change" - marks as touched but does not validate on blur', () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { handleBlur, handleChange, getError, touched } = useFormValidation(
        schema,
        formData,
        {
          mode: "change",
        },
      );

      handleBlur("field");
      expect(touched.value.field).toBe(true);
      expect(getError("field").value).toBeUndefined();
    });

    test('mode "change" - validates on change if touched', () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { handleBlur, handleChange, getError } = useFormValidation(
        schema,
        formData,
        {
          mode: "change",
        },
      );

      handleBlur("field");
      formData.value.field = "valid";
      handleChange("field");
      expect(getError("field").value).toBeUndefined();
    });

    test('mode "submit" - validates and marks as touched on blur', () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { handleBlur, touched, getError } = useFormValidation(
        schema,
        formData,
        {
          mode: "submit",
        },
      );

      handleBlur("field");

      expect(touched.value.field).toBe(true);
      expect(getError("field").value).toBe("field is required");
    });

    test('mode "submit" - clears error on change', () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { handleBlur, handleChange, getError } = useFormValidation(
        schema,
        formData,
        {
          mode: "submit",
        },
      );

      handleBlur("field");
      expect(getError("field").value).toBeDefined();

      handleChange("field");
      expect(getError("field").value).toBeUndefined();
    });
  });

  describe("hasError function", () => {
    test("returns true when field has error and is touched", () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { validateField, hasError, touched } = useFormValidation(
        schema,
        formData,
      );

      touched.value.field = true;
      validateField("field");
      expect(hasError("field").value).toBe(true);

      formData.value.field = "valid";
      validateField("field");
      expect(hasError("field").value).toBe(false);
    });

    test("returns false when field has error but not touched", () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { validateField, hasError, touched } = useFormValidation(
        schema,
        formData,
      );

      validateField("field");
      touched.value.field = false;
      expect(hasError("field").value).toBe(false);
    });

    test("returns false when field is touched but has no error", () => {
      const formData = ref({ field: "valid" });
      const schema = { field: { required: true } };

      const { validateField, hasError, touched } = useFormValidation(
        schema,
        formData,
      );

      validateField("field");
      touched.value.field = true;
      expect(hasError("field").value).toBe(false);
    });
  });

  describe("getError function", () => {
    test("returns error message for field", () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBe("field is required");
    });

    test("returns undefined when field has no error", () => {
      const formData = ref({ field: "valid" });
      const schema = { field: { required: true } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBeUndefined();
    });
  });

  describe("isValid computed", () => {
    test("returns true when no errors", () => {
      const formData = ref({ field: "valid" });
      const schema = { field: { required: true } };

      const { isValid } = useFormValidation(schema, formData);
      expect(isValid.value).toBe(true);
    });

    test("returns false when there are errors", () => {
      const formData = ref({ field: "" });
      const schema = { field: { required: true } };

      const { validateField, isValid } = useFormValidation(schema, formData);

      validateField("field");
      expect(isValid.value).toBe(false);
    });
  });

  describe("edge cases", () => {
    test("handles number input for min/max validation", () => {
      const formData = ref({ rating: 3 });
      const schema = { rating: { min: 1, max: 5 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("rating");
      expect(getError("rating").value).toBeUndefined();
    });

    test("handles string number input for min/max validation", () => {
      const formData = ref({ rating: "3" });
      const schema = { rating: { min: 1, max: 5 } };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("rating");
      expect(getError("rating").value).toBeUndefined();
    });

    test("handles multiple validation failures - returns first error", () => {
      const formData = ref({ field: "x" });
      const schema = {
        field: {
          required: true,
          minLength: 5,
          maxLength: 10,
          pattern: /^[a-z]+$/,
        },
      };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBeDefined();
    });

    test("handles fields with no validation rules", () => {
      const formData = ref({ field: "anything" });
      const schema = { field: {} };

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBeUndefined();
    });

    test("handles fields not in schema", () => {
      const formData = ref({ field: "value" });
      const schema = {} as any;

      const { validateField, getError } = useFormValidation(schema, formData);

      validateField("field");
      expect(getError("field").value).toBeUndefined();
    });
  });
});
