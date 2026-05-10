import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { passwordSchema } from "./passwordShema";

/*
  Zod schema = single source of truth
  for the entire form.

  Here we describe:
  - field types
  - validation rules
  - custom validation
  - cross-field validation
*/
const formSchema = z
  .object({
    /*
      Validate email format
    */
    email: z.email("Mail!"),

    /*
      passwordSchema is extracted
      into a separate file so it can
      be reused across the project
    */
    password: passwordSchema,

    /*
      confirmPassword:
      - must be a string
      - must contain at least 1 character
    */
    confirmPassword: z
      .string()
      .min(1, { error: "confirm password is required!" }),

    /*
      HTML input always returns string.

      z.coerce.number()
      automatically converts:

      "18" -> 18

      Without coerce:
      validation would fail because
      input value is string
    */
    age: z.coerce.number().min(1, "Age is required!"),

    /*
      role can only contain
      one of enum values.

      optional() is required because:
      initially no radio button is selected.

      Initial state:
      role = undefined
    */
    role: z
      .enum(["READ_ONLY", "EMPLOYEE", "ADMIN"])
      .optional()
      .refine((data) => data !== undefined, {
        error: "choose a role",
      }),

    /*
      adminCode is optional because
      the field is rendered only
      for ADMIN role
    */
    adminCode: z.string().optional(),
  })

  /*
    Cross-field validation.

    refine() on object level is used when:
    validation depends on multiple fields.
  */
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password unmatched!",

    /*
      path defines which field
      should receive the error
    */
    path: ["confirmPassword"],
  })

  /*
    If role === ADMIN
    then adminCode must equal SECRET
  */
  .refine((data) => data.role !== "ADMIN" || data.adminCode === "SECRET", {
    error: "Admin code required",
    path: ["adminCode"],
  });

/*
  Input type:
  raw values BEFORE zod transformations

  Example:
  age = string from input
*/
type FormStateInput = z.input<typeof formSchema>;

/*
  Output type:
  transformed values AFTER zod parsing

  Example:
  age = number
*/
type FormStateOutput = z.output<typeof formSchema>;

const Form = () => {
  /*
    useForm generics:

    1. Input type
    2. Context type
    3. Output type after resolver
  */
  const { register, control, handleSubmit, formState, reset, watch } =
    useForm<FormStateInput, unknown, FormStateOutput>({
      /*
        Connect React Hook Form with Zod
      */
      resolver: zodResolver(formSchema),

      /*
        Initial form values
      */
      defaultValues: {
        role: undefined,
      },
    });

  /*
    Contains all validation errors
  */
  const { errors } = formState;

  /*
    watch() subscribes component
    to field changes.

    Component re-renders
    when role changes
  */
  const role = watch("role");

  /*
    handleSubmit():
    - runs validation
    - calls onSubmit only if form is valid
  */
  const onSubmit = (data: FormStateOutput) => {
    /*
      data is fully validated
      and properly typed
    */
    console.log(data);

    /*
      Reset form state
      to defaultValues
    */
    reset();
  };

  return (
    <div>
      <div>
        <h2>React Hook Form</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} action="">
        <div>
          {/*
            register() connects input
            to RHF internal state
          */}
          <input type="text" placeholder="email" {...register("email")} />

          {/*
            errors.field?.message
            contains zod validation error
          */}
          {errors.email?.message && <p>{errors.email?.message}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="*******"
            {...register("password")}
          />

          {errors.password?.message && <p>{errors.password?.message}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="confirm password"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword?.message && (
            <p>{errors.confirmPassword?.message}</p>
          )}
        </div>

        <div>
          <input type="text" placeholder="18" {...register("age")} />

          {errors.age?.message && <p>{errors.age?.message}</p>}
        </div>

        {/*
          Controller is used for:
          - controlled components
          - custom UI components
          - libraries like MUI/Antd

          register() works best
          with native uncontrolled inputs
        */}
        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange } }) => (
            <div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="ADMIN"
                    checked={value === "ADMIN"}
                    onChange={() => onChange("ADMIN")}
                  />
                  ADMIN
                </label>

                <label>
                  <input
                    type="radio"
                    value="READ_ONLY"
                    checked={value === "READ_ONLY"}
                    onChange={() => onChange("READ_ONLY")}
                  />
                  READ_ONLY
                </label>

                <label>
                  <input
                    type="radio"
                    value="EMPLOYEE"
                    checked={value === "EMPLOYEE"}
                    onChange={() => onChange("EMPLOYEE")}
                  />
                  EMPLOYEE
                </label>
              </div>

              {errors.role?.message && <p>{errors.role?.message}</p>}
            </div>
          )}
        />

        {/*
          Conditional rendering.

          adminCode field exists
          only for ADMIN role
        */}
        {role === "ADMIN" && (
          <div>
            <input
              type="password"
              placeholder="admin code"
              {...register("adminCode", {
                /*
                  shouldUnregister removes field
                  from RHF state after unmount.

                  Without it:
                  old value remains in form state
                */
                shouldUnregister: true,
              })}
            />

            {errors.adminCode?.message && <p>{errors.adminCode?.message}</p>}
          </div>
        )}

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Form;