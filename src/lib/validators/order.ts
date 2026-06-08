import { z } from 'zod'

export const createOrderSchema = z.object({
  serviceSlug: z.string().min(3),
  tierId: z.enum(['ucuz', 'standart', 'premium', 'gercek']),
  packageId: z.string().min(1),
  target: z.string().min(1).max(500),
  email: z.string().email().optional().or(z.literal('')),
})

export const lookupOrderSchema = z.object({
  code: z.string().min(4).max(20),
  email: z.string().email().optional().or(z.literal('')),
})

export const refillOrderSchema = z.object({
  code: z.string().min(4).max(20),
  email: z.string().email().optional().or(z.literal('')),
})
