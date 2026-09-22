import { api } from '@/lib/api';

export interface Lead {
  id?: string;
  propertyId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message: string;
  createdAt?: string;
}

export async function submitLead(lead: Lead): Promise<{ leadId: string }> {
  return await api.post<{ leadId: string }>('/leads', lead);
}

export async function getLeadsForProperty(propertyId: string): Promise<Lead[]> {
  return await api.get<Lead[]>(`/leads/property/${propertyId}`);
}
