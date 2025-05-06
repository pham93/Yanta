import { z } from "zod";

export const userPreferencesSchema = z.object({
  sidebarOpened: z.boolean().optional(),
  commentOpened: z.boolean().optional(),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
