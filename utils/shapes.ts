import { z } from 'zod'

// TODO: Restrictions on display name
// emails can be longer than 20 characters so we may want to reconsider restrictions
export const LOGIN_SHAPE = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[a-z]/, 'Password must contain at least one lower case character')
    .regex(/[A-Z]/, 'Password must contain at least one upper case character')
    .regex(/[!@#$%^&*+`~']/, "Password must contain at least one of the following characters: !@#$%^&*+`~'"),
  rememberMe: z.boolean().optional(),
})

export const themeOption = z.union([z.literal('day'), z.literal('night'), z.literal('auto')])
export const timestamped = z.object({
  inserted_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const conversation = timestamped.extend({
  id: z.string().uuid(),
  private: z.boolean(),
  alias: z.union([z.string(), z.null()]),
})

export const user = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  display_name: z.string(),
})

export const userMe = user.extend({
  confirmed_at: z.union([z.string().datetime(), z.null()]),
})

export const profile = z.object({
  hidden: z.boolean(),
  theme: themeOption,
  magnification: z.number().min(0.7).max(1.4),
  recents: z.array(z.string()),
})

export const message = timestamped.extend({
  sender: z.string().uuid(),
  content: z.string(),
})

export const REGISTER_SHAPE = LOGIN_SHAPE.extend({
  displayName: z.union([z.undefined(), z.string()]),
  password: z
    .string()
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[a-z]/, 'Password must contain at least one lower case character')
    .regex(/[A-Z]/, 'Password must contain at least one upper case character')
    .regex(/[!@#$%^&*+`~']/, "Password must contain at least one of the following characters: !@#$%^&*+`~'"),
})

export const PARTIAL_AUTH_SHAPE = z.object({
  user: z.intersection(userMe, profile),
  users: z.array(user),
  conversations: z.array(conversation),
  auth_token: z.string(),
})

export const COMPLETE_AUTH_SHAPE = PARTIAL_AUTH_SHAPE.extend({
  refresh_token: z.string(),
})

export const RECENTS_DATA_SHAPE = z.object({
  recents: z.array(z.string()),
  id: z.string(),
})