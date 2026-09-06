export type CustomFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'date'
  | 'boolean'
  | 'select'
  | 'tags';

export interface CustomFieldDefinition {
  id: string;
  collection: string;
  key: string;
  label: string;
  type: CustomFieldType;
  options?: string[]; // for 'select' or 'tags'
  defaultValue?: string | number | boolean;
  required?: boolean;
  createdAt: string;
}

const CUSTOM_FIELDS_DEF_KEY = 'nellimo_custom_field_defs_v1';
const CUSTOM_FIELDS_VALUES_KEY = 'nellimo_custom_field_values_v1';

export function getCustomFieldDefinitions(collection?: string): CustomFieldDefinition[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_FIELDS_DEF_KEY);
    const defs: CustomFieldDefinition[] = raw ? JSON.parse(raw) : [];
    if (!collection) return defs;
    return defs.filter((d) => d.collection === collection);
  } catch (e) {
    console.error('Failed to load custom field definitions', e);
    return [];
  }
}

export function saveCustomFieldDefinition(def: Omit<CustomFieldDefinition, 'id' | 'createdAt'>): CustomFieldDefinition {
  const all = getCustomFieldDefinitions();
  const id = `cf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const newDef: CustomFieldDefinition = {
    ...def,
    id,
    createdAt: new Date().toISOString(),
  };
  const updated = [...all, newDef];
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_FIELDS_DEF_KEY, JSON.stringify(updated));
  }
  return newDef;
}

export function deleteCustomFieldDefinition(id: string): void {
  const all = getCustomFieldDefinitions();
  const updated = all.filter((d) => d.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_FIELDS_DEF_KEY, JSON.stringify(updated));
  }
}

export type EntityCustomValues = Record<string, string | number | boolean | string[] | undefined>;

export function getEntityCustomValues(collection: string, entityId: string): EntityCustomValues {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CUSTOM_FIELDS_VALUES_KEY);
    const allValues: Record<string, EntityCustomValues> = raw ? JSON.parse(raw) : {};
    const compositeKey = `${collection}:${entityId}`;
    return allValues[compositeKey] || {};
  } catch (e) {
    console.error('Failed to load entity custom values', e);
    return {};
  }
}

export function saveEntityCustomValues(
  collection: string,
  entityId: string,
  values: Partial<EntityCustomValues>
): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CUSTOM_FIELDS_VALUES_KEY);
    const allValues: Record<string, EntityCustomValues> = raw ? JSON.parse(raw) : {};
    const compositeKey = `${collection}:${entityId}`;
    allValues[compositeKey] = {
      ...(allValues[compositeKey] || {}),
      ...values,
    };
    localStorage.setItem(CUSTOM_FIELDS_VALUES_KEY, JSON.stringify(allValues));
  } catch (e) {
    console.error('Failed to save entity custom values', e);
  }
}
