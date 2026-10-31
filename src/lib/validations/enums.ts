import { z } from 'zod';

export const eventTypeEnum = z.enum(['wedding', 'birthday', 'community_event']);
export const eventStatusEnum = z.enum(['draft', 'planning', 'confirmed', 'completed']);
export const budgetCategoryEnum = z.enum([
  'venue',
  'catering',
  'decor',
  'photography',
  'entertainment',
  'apparel_makeup',
  'invitations_favors',
  'logistics_permits',
  'contingency',
]);
export const taskStatusEnum = z.enum(['todo', 'in_progress', 'done', 'overdue']);
export const taskPriorityEnum = z.enum(['low', 'medium', 'high', 'critical']);
export const vendorStatusEnum = z.enum([
  'shortlisted',
  'contacted',
  'quoted',
  'booked',
  'cancelled',
]);
export const ideaKindEnum = z.enum(['theme', 'menu', 'risk', 'run_sheet', 'saving_tip']);
