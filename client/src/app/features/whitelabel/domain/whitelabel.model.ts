import type { RestaurantContent } from '../../restaurant/domain/content.model';

export type IWhitelabel = {
  whitelabelId: string;
  name?: string;
  domain?: string;
  domains?: string[];
  colors?: { primary: string; background: string; text: string; button: string };
  logo?: string;
  theme?: string;
  enabledFeatures?: Record<string, boolean>;
  contactInfo?: { address?: string; phone?: string; email?: string };
  content?: RestaurantContent;
};
