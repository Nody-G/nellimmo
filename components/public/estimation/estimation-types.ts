import { PropertyType } from '@/lib/types';

export interface PublicEstimationFormData {
  propertyType: PropertyType;
  city: string;
  address: string;
  livingArea: string;
  landArea: string;
  roomsCount: string;
  hasPool: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
