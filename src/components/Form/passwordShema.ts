import z from "zod";

export const passwordSchema = z
.string().min(6, 'at least 6 chars')
.regex(/[A-Z]/, 'at least one capital letter')
.regex(/[0-9]/, 'at least one number')

export const emailSchema = z.email('enter correct email')