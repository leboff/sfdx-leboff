import { MetadataInfo } from 'jsforce';

export interface Value {
  fullName: string;
  default: boolean;
  label: string;
  isActive: boolean;
}

export interface ValueSetDefinition {
  value: Value[];
}

export interface ValueSet {
  valueSetDefinition: ValueSetDefinition;
}
export interface CustomField extends MetadataInfo {
  trackHistory: string;
  valueSet: ValueSet;
}
