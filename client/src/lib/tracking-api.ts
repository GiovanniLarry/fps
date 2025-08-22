import { apiRequest } from "./queryClient";
import type { Package } from "@shared/schema";

export interface TrackingData {
  trackingNumber: string;
  carrier: string;
  status: string;
  origin: string;
  destination: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export async function trackPackage(trackingNumber: string): Promise<TrackingData> {
  const response = await apiRequest('POST', `/api/track/${trackingNumber}`);
  return response.json();
}

export async function createPackage(data: { trackingNumber: string; title?: string; userId?: string }): Promise<Package> {
  const response = await apiRequest('POST', '/api/packages', data);
  return response.json();
}

export async function getPackages(userId?: string): Promise<Package[]> {
  const url = userId ? `/api/packages?userId=${userId}` : '/api/packages';
  const response = await apiRequest('GET', url);
  return response.json();
}

export async function getPackage(id: string): Promise<Package> {
  const response = await apiRequest('GET', `/api/packages/${id}`);
  return response.json();
}

export async function deletePackage(id: string): Promise<void> {
  await apiRequest('DELETE', `/api/packages/${id}`);
}

export async function bulkImportPackages(data: { trackingNumbers: string[]; userId?: string }): Promise<Package[]> {
  const response = await apiRequest('POST', '/api/packages/bulk', data);
  return response.json();
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'status-delivered';
    case 'in_transit':
    case 'transit':
      return 'status-transit';
    case 'out_for_delivery':
      return 'status-out_for_delivery';
    case 'processing':
    case 'pending':
      return 'status-processing';
    case 'exception':
      return 'status-exception';
    default:
      return 'status-processing';
  }
}

export function getStatusText(status: string): string {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'Delivered';
    case 'in_transit':
    case 'transit':
      return 'In Transit';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'processing':
      return 'Processing';
    case 'pending':
      return 'Pending';
    case 'exception':
      return 'Exception';
    default:
      return 'Unknown';
  }
}
