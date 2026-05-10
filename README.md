# React Hook Form + Zod

<div>

<img
    src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"
    alt="TypeScript"
/>
<img
    src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"
    alt="React"
    />
<img
    src="https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white"
    alt="React Hook Form"
  />
<img
    src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white"
    alt="Zod"
  />

</div>

---

Simple example of form validation using:

- React Hook Form
- Zod
- TypeScript

This project demonstrates:

- Form state management
- Schema validation
- Type-safe forms
- Cross-field validation
- Conditional fields
- Controlled components with `Controller`

---

# Installation

```bash
npm install
```

Install dependencies:

```bash
npm install react-hook-form zod @hookform/resolvers
```

Run development server:

```bash
npm run dev
```

---

# Why React Hook Form?

React Hook Form provides:

- Minimal re-renders
- High performance
- Easy form state management
- Simple validation integration
- Excellent TypeScript support

---

# Why Zod?

Zod provides:

- Runtime validation
- Static TypeScript inference
- Schema-based validation
- Safe data parsing
- Cross-field validation

---

# Validation

TypeScript and Zod solve different problems and are used together for reliable form and data handling.

TypeScript works at compile time and ensures type safety in your code. It helps you define what shape your data should have, but it does not validate real data at runtime. This means TypeScript cannot protect you from invalid API responses, user input, or external data sources.

Zod, on the other hand, works at runtime. It validates actual data and ensures that incoming values match the expected schema. At the same time, it can infer TypeScript types directly from the schema, which removes duplication and keeps types and validation in sync.

Together, they eliminate the gap between expected types and real-world data, making applications more predictable and safer.

---

# Form Architecture

## 1. Create Zod Schema

```ts
const formSchema = z.object({
  email: z.email(),
  password: z.string(),
});
```

The schema becomes the single source of truth for:

- validation
- types
- transformations

---

## 2. Connect Zod to React Hook Form

```ts
useForm({
  resolver: zodResolver(formSchema),
});
```

`zodResolver` allows React Hook Form to delegate validation to Zod.

---

## 3. Register Inputs

```tsx
<input {...register("email")} />
```

`register()` connects native inputs to RHF internal state.

---

## 4. Display Errors

```tsx
{
  errors.email?.message && <p>{errors.email.message}</p>;
}
```

Validation errors are available inside:

```ts
formState.errors;
```

---

# Controlled Components

For controlled inputs or custom UI libraries (`MUI`, `Ant Design`, etc.) use `Controller`.

Example:

```tsx
<Controller
  control={control}
  name="role"
  render={({ field }) => (
    <input value={field.value} onChange={field.onChange} />
  )}
/>
```

---

# Cross-Field Validation

Zod supports object-level validation using `.refine()`.

Example:

```ts
.refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  error: "Passwords do not match",
});
```

Useful for:

- password confirmation
- conditional validation
- dependent fields

---

# Type Safety

## Input Type

```ts
type FormInput = z.input<typeof formSchema>;
```

Represents raw form values before parsing.

---

## Output Type

```ts
type FormOutput = z.output<typeof formSchema>;
```

Represents validated/transformed data after Zod parsing.

---

# Conditional Fields

Example:

```tsx
{
  role === "ADMIN" && <input {...register("adminCode")} />;
}
```

`watch()` is used to subscribe to field changes.

---

# Important RHF Concepts

## watch()

Subscribes component to form field changes.

```ts
const role = watch("role");
```

---

## reset()

Resets form state to default values.

```ts
reset();
```

---

## handleSubmit()

Runs validation before submit.

```ts
<form onSubmit={handleSubmit(onSubmit)}>
```

---

# Example Features

This example includes:

- Email validation
- Password validation
- Confirm password validation
- Age transformation (`string -> number`)
- Role selection
- Conditional admin code field
- Cross-field validation

---

# Useful Links

Based on the guide by Матвей Клёнов

- YouTube Channel: https://www.youtube.com/@y0na24
- Guide: https://www.youtube.com/watch?v=vI28woiCpCQ
