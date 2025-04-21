/**
 * Calendar Integration Service
 * 
 * This service provides integration with calendar systems for appointment scheduling.
 * It supports Google Calendar, Microsoft Outlook, and a mock implementation for development.
 */

import { v4 as uuidv4 } from 'uuid';

// Define appointment types
export interface Appointment {
  id: string;
  businessId: string;
  serviceId?: string;
  serviceName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailableTimeSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

export interface CalendarProvider {
  name: string;
  id: string;
  type: 'google' | 'microsoft' | 'mock';
  connected: boolean;
  primaryCalendarId?: string;
}

// Mock data for development
const mockAppointments: Appointment[] = [];
const mockTimeSlots: Record<string, AvailableTimeSlot[]> = {};
const mockProviders: Record<string, CalendarProvider> = {
  'mock-provider': {
    name: 'Mock Calendar',
    id: 'mock-provider',
    type: 'mock',
    connected: true,
    primaryCalendarId: 'primary'
  }
};

/**
 * Get available calendar providers for a business
 */
export async function getCalendarProviders(businessId: string): Promise<CalendarProvider[]> {
  try {
    // In a real implementation, this would fetch from the database
    // For now, return mock data
    return Object.values(mockProviders);
  } catch (error) {
    console.error('Error getting calendar providers:', error);
    return [];
  }
}

/**
 * Connect to a calendar provider
 */
export async function connectCalendarProvider(
  businessId: string,
  providerType: 'google' | 'microsoft' | 'mock',
  authCode?: string
): Promise<CalendarProvider | null> {
  try {
    // In a real implementation, this would use OAuth to connect to the provider
    // For now, create a mock provider
    const providerId = `${providerType}-${uuidv4()}`;
    
    const provider: CalendarProvider = {
      name: providerType === 'google' ? 'Google Calendar' : 
            providerType === 'microsoft' ? 'Microsoft Outlook' : 'Mock Calendar',
      id: providerId,
      type: providerType,
      connected: true,
      primaryCalendarId: 'primary'
    };
    
    // Store the provider
    mockProviders[providerId] = provider;
    
    return provider;
  } catch (error) {
    console.error('Error connecting calendar provider:', error);
    return null;
  }
}

/**
 * Disconnect from a calendar provider
 */
export async function disconnectCalendarProvider(
  businessId: string,
  providerId: string
): Promise<boolean> {
  try {
    // In a real implementation, this would revoke access tokens
    // For now, just remove the mock provider
    if (mockProviders[providerId]) {
      delete mockProviders[providerId];
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error disconnecting calendar provider:', error);
    return false;
  }
}

/**
 * Get available time slots for a date range
 */
export async function getAvailableTimeSlots(
  businessId: string,
  providerId: string,
  startDate: Date,
  endDate: Date,
  duration: number = 60 // in minutes
): Promise<AvailableTimeSlot[]> {
  try {
    // Check if provider exists
    if (!mockProviders[providerId]) {
      throw new Error('Calendar provider not found');
    }
    
    // Generate time slots for each day in the range
    const slots: AvailableTimeSlot[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Skip weekends (0 = Sunday, 6 = Saturday)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Business hours: 9 AM to 5 PM
        const businessStart = new Date(currentDate);
        businessStart.setHours(9, 0, 0, 0);
        
        const businessEnd = new Date(currentDate);
        businessEnd.setHours(17, 0, 0, 0);
        
        // Generate slots at 30-minute intervals
        const slotStart = new Date(businessStart);
        
        while (slotStart.getTime() + duration * 60000 <= businessEnd.getTime()) {
          const slotEnd = new Date(slotStart.getTime() + duration * 60000);
          
          // Check if slot overlaps with existing appointments
          const isAvailable = !mockAppointments.some(appointment => {
            return (
              appointment.businessId === businessId &&
              appointment.status !== 'cancelled' &&
              slotStart < appointment.endTime &&
              slotEnd > appointment.startTime
            );
          });
          
          slots.push({
            startTime: new Date(slotStart),
            endTime: new Date(slotEnd),
            available: isAvailable
          });
          
          // Move to next slot
          slotStart.setMinutes(slotStart.getMinutes() + 30);
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Store the slots for this business
    mockTimeSlots[businessId] = slots;
    
    return slots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    return [];
  }
}

/**
 * Create an appointment
 */
export async function createAppointment(
  businessId: string,
  providerId: string,
  appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Appointment | null> {
  try {
    // Check if provider exists
    if (!mockProviders[providerId]) {
      throw new Error('Calendar provider not found');
    }
    
    // Check if the time slot is available
    const isAvailable = !mockAppointments.some(existingAppointment => {
      return (
        existingAppointment.businessId === businessId &&
        existingAppointment.status !== 'cancelled' &&
        appointment.startTime < existingAppointment.endTime &&
        appointment.endTime > existingAppointment.startTime
      );
    });
    
    if (!isAvailable) {
      throw new Error('Time slot is not available');
    }
    
    // Create the appointment
    const now = new Date();
    const newAppointment: Appointment = {
      ...appointment,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    // Store the appointment
    mockAppointments.push(newAppointment);
    
    return newAppointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    return null;
  }
}

/**
 * Update an appointment
 */
export async function updateAppointment(
  businessId: string,
  appointmentId: string,
  updates: Partial<Appointment>
): Promise<Appointment | null> {
  try {
    // Find the appointment
    const index = mockAppointments.findIndex(
      appointment => appointment.id === appointmentId && appointment.businessId === businessId
    );
    
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    // If updating time, check if the new time slot is available
    if (updates.startTime || updates.endTime) {
      const newStartTime = updates.startTime || mockAppointments[index].startTime;
      const newEndTime = updates.endTime || mockAppointments[index].endTime;
      
      const isAvailable = !mockAppointments.some(existingAppointment => {
        return (
          existingAppointment.id !== appointmentId &&
          existingAppointment.businessId === businessId &&
          existingAppointment.status !== 'cancelled' &&
          newStartTime < existingAppointment.endTime &&
          newEndTime > existingAppointment.startTime
        );
      });
      
      if (!isAvailable) {
        throw new Error('New time slot is not available');
      }
    }
    
    // Update the appointment
    const updatedAppointment: Appointment = {
      ...mockAppointments[index],
      ...updates,
      updatedAt: new Date()
    };
    
    mockAppointments[index] = updatedAppointment;
    
    return updatedAppointment;
  } catch (error) {
    console.error('Error updating appointment:', error);
    return null;
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  businessId: string,
  appointmentId: string
): Promise<boolean> {
  try {
    // Find the appointment
    const index = mockAppointments.findIndex(
      appointment => appointment.id === appointmentId && appointment.businessId === businessId
    );
    
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    // Update the appointment status
    mockAppointments[index] = {
      ...mockAppointments[index],
      status: 'cancelled',
      updatedAt: new Date()
    };
    
    return true;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return false;
  }
}

/**
 * Get appointments for a business
 */
export async function getAppointments(
  businessId: string,
  startDate?: Date,
  endDate?: Date,
  status?: 'confirmed' | 'pending' | 'cancelled'
): Promise<Appointment[]> {
  try {
    // Filter appointments by business ID
    let filteredAppointments = mockAppointments.filter(
      appointment => appointment.businessId === businessId
    );
    
    // Filter by date range if provided
    if (startDate) {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.startTime >= startDate
      );
    }
    
    if (endDate) {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.startTime <= endDate
      );
    }
    
    // Filter by status if provided
    if (status) {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.status === status
      );
    }
    
    return filteredAppointments;
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
}

/**
 * Get an appointment by ID
 */
export async function getAppointmentById(
  businessId: string,
  appointmentId: string
): Promise<Appointment | null> {
  try {
    // Find the appointment
    const appointment = mockAppointments.find(
      appointment => appointment.id === appointmentId && appointment.businessId === businessId
    );
    
    return appointment || null;
  } catch (error) {
    console.error('Error getting appointment:', error);
    return null;
  }
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}
