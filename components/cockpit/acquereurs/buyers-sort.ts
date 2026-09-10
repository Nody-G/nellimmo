import type { Buyer, Property } from '@/lib/types';
import { getMatchingProperties } from './acquereurs-types';
import type { AcquereursSortOption } from './AcquereursFilterBar';

export function sortBuyers(
  buyers: Buyer[],
  sortBy: AcquereursSortOption,
  activeProperties: Property[]
): Buyer[] {
  return [...buyers].sort((a, b) => {
    switch (sortBy) {
      case 'matching_desc': {
        const countA = getMatchingProperties(activeProperties, a).length;
        const countB = getMatchingProperties(activeProperties, b).length;
        if (countB !== countA) return countB - countA;
        return b.budget_max - a.budget_max;
      }
      case 'matching_asc': {
        const countA = getMatchingProperties(activeProperties, a).length;
        const countB = getMatchingProperties(activeProperties, b).length;
        if (countA !== countB) return countA - countB;
        return a.budget_max - b.budget_max;
      }
      case 'budget_desc':
        return b.budget_max - a.budget_max;
      case 'budget_asc':
        return a.budget_max - b.budget_max;
      case 'surface_desc':
        return (b.min_surface || 0) - (a.min_surface || 0);
      case 'surface_asc':
        return (a.min_surface || 0) - (b.min_surface || 0);
      case 'recent': {
        const dateA = new Date(a.created_at).getTime() || 0;
        const dateB = new Date(b.created_at).getTime() || 0;
        return dateB - dateA;
      }
      case 'oldest': {
        const dateA = new Date(a.created_at).getTime() || 0;
        const dateB = new Date(b.created_at).getTime() || 0;
        return dateA - dateB;
      }
      case 'name_asc': {
        const comp = a.last_name.localeCompare(b.last_name, 'fr', { sensitivity: 'base' });
        return comp !== 0 ? comp : a.first_name.localeCompare(b.first_name, 'fr', { sensitivity: 'base' });
      }
      case 'name_desc': {
        const comp = b.last_name.localeCompare(a.last_name, 'fr', { sensitivity: 'base' });
        return comp !== 0 ? comp : b.first_name.localeCompare(a.first_name, 'fr', { sensitivity: 'base' });
      }
      case 'financing': {
        const priorityOrder: Record<string, number> = {
          accord_bancaire_valide: 4,
          comptant: 3,
          etude_courtier: 2,
          en_attente: 1,
        };
        const pA = priorityOrder[a.financing_status] || 0;
        const pB = priorityOrder[b.financing_status] || 0;
        if (pB !== pA) return pB - pA;
        return b.budget_max - a.budget_max;
      }
      default:
        return 0;
    }
  });
}
