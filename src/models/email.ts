/**
 * Email Marketing Data Models
 *
 * These models define the structure for email marketing functionality
 * including campaigns, templates, contacts, and analytics.
 */

// Contact Types
export type ContactStatus = 'active' | 'unsubscribed' | 'bounced' | 'spam';

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  position?: string;
  phone?: string;
  status: ContactStatus;
  tags: string[];
  customFields?: Record<string, string>;
  lastContacted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  contacts: string[]; // Contact IDs
  createdAt: Date;
  updatedAt: Date;
}

// Email Template Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  previewText?: string;
  category: 'promotional' | 'newsletter' | 'transactional' | 'cold-outreach' | 'follow-up';
  variables: string[]; // List of variable names used in the template
  createdAt: Date;
  updatedAt: Date;
}

// Campaign Types
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  templateId: string;
  listIds: string[]; // Contact list IDs
  status: CampaignStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  completedAt?: Date;
  stats?: CampaignStats;
  createdAt: Date;
  updatedAt: Date;
}

// Email Analytics Types
export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  complained: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  lastUpdated: Date;
}

export interface EmailEvent {
  id: string;
  campaignId: string;
  contactId: string;
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'complained';
  timestamp: Date;
  metadata?: {
    url?: string; // For click events
    userAgent?: string;
    ip?: string;
    location?: string;
    device?: string;
  };
}

// Mock Data Functions
export function getMockContacts(): Contact[] {
  return [
    {
      id: 'contact-1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Inc.',
      position: 'Marketing Manager',
      status: 'active',
      tags: ['lead', 'marketing'],
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date('2023-06-15')
    },
    {
      id: 'contact-2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      company: 'XYZ Corp',
      position: 'CEO',
      status: 'active',
      tags: ['lead', 'decision-maker'],
      createdAt: new Date('2023-06-20'),
      updatedAt: new Date('2023-06-20')
    },
    {
      id: 'contact-3',
      email: 'mike.johnson@example.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      company: 'Johnson & Co',
      position: 'Sales Director',
      status: 'active',
      tags: ['customer', 'sales'],
      createdAt: new Date('2023-07-05'),
      updatedAt: new Date('2023-07-05')
    },
    {
      id: 'contact-4',
      email: 'sarah.williams@example.com',
      firstName: 'Sarah',
      lastName: 'Williams',
      company: 'Williams Design',
      position: 'Owner',
      status: 'active',
      tags: ['lead', 'small-business'],
      createdAt: new Date('2023-07-10'),
      updatedAt: new Date('2023-07-10')
    },
    {
      id: 'contact-5',
      email: 'david.brown@example.com',
      firstName: 'David',
      lastName: 'Brown',
      company: 'Brown Consulting',
      position: 'Consultant',
      status: 'unsubscribed',
      tags: ['lead'],
      createdAt: new Date('2023-07-15'),
      updatedAt: new Date('2023-07-20')
    }
  ];
}

export function getMockContactLists(): ContactList[] {
  return [
    {
      id: 'list-1',
      name: 'All Leads',
      description: 'All potential customers',
      contacts: ['contact-1', 'contact-2', 'contact-4', 'contact-5'],
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2023-07-15')
    },
    {
      id: 'list-2',
      name: 'Active Customers',
      description: 'Current paying customers',
      contacts: ['contact-3'],
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2023-07-05')
    },
    {
      id: 'list-3',
      name: 'Decision Makers',
      description: 'Contacts with decision-making authority',
      contacts: ['contact-2', 'contact-4'],
      createdAt: new Date('2023-06-25'),
      updatedAt: new Date('2023-07-10')
    }
  ];
}

export function getMockEmailTemplates(): EmailTemplate[] {
  return [
    {
      id: 'template-1',
      name: 'Cold Outreach - Introduction',
      subject: 'Introducing our services to {{company}}',
      content: `
        <p>Hello {{firstName}},</p>
        <p>I hope this email finds you well. I wanted to reach out because I believe our services at [Your Company] could be valuable for {{company}}.</p>
        <p>We specialize in helping businesses like yours with [brief description of your services].</p>
        <p>Would you be available for a quick 15-minute call this week to discuss how we might be able to help?</p>
        <p>Best regards,<br>[Your Name]<br>[Your Position]<br>[Your Company]</p>
      `,
      previewText: 'Introducing our services that can help your business grow',
      category: 'cold-outreach',
      variables: ['firstName', 'company'],
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2023-06-01')
    },
    {
      id: 'template-2',
      name: 'Follow-up After Meeting',
      subject: 'Following up on our conversation, {{firstName}}',
      content: `
        <p>Hi {{firstName}},</p>
        <p>Thank you for taking the time to speak with me today. I enjoyed learning more about {{company}} and your role as {{position}}.</p>
        <p>As discussed, here are the next steps:</p>
        <ul>
          <li>[Next step 1]</li>
          <li>[Next step 2]</li>
        </ul>
        <p>I'll follow up next week to see how things are progressing. In the meantime, please don't hesitate to reach out if you have any questions.</p>
        <p>Best regards,<br>[Your Name]<br>[Your Position]<br>[Your Company]</p>
      `,
      previewText: 'Next steps after our meeting',
      category: 'follow-up',
      variables: ['firstName', 'company', 'position'],
      createdAt: new Date('2023-06-05'),
      updatedAt: new Date('2023-06-05')
    },
    {
      id: 'template-3',
      name: 'Monthly Newsletter',
      subject: 'Your Monthly Update from [Your Company]',
      content: `
        <h1>Monthly Newsletter - {{month}} {{year}}</h1>
        <p>Hello {{firstName}},</p>
        <p>Here's what's new this month:</p>
        <h2>Latest Updates</h2>
        <p>[Update 1]</p>
        <p>[Update 2]</p>
        <h2>Tips & Tricks</h2>
        <p>[Tip 1]</p>
        <p>[Tip 2]</p>
        <h2>Upcoming Events</h2>
        <p>[Event 1]</p>
        <p>[Event 2]</p>
        <p>We hope you found this newsletter informative. If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The [Your Company] Team</p>
      `,
      previewText: 'Your monthly update with the latest news and tips',
      category: 'newsletter',
      variables: ['firstName', 'month', 'year'],
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2023-06-10')
    }
  ];
}

export function getMockEmailCampaigns(): EmailCampaign[] {
  return [
    {
      id: 'campaign-1',
      name: 'Initial Outreach - June 2023',
      subject: 'Introducing our services to {{company}}',
      fromName: 'John Smith',
      fromEmail: 'john@yourcompany.com',
      replyTo: 'john@yourcompany.com',
      templateId: 'template-1',
      listIds: ['list-1'],
      status: 'sent',
      scheduledAt: new Date('2023-06-20T10:00:00'),
      sentAt: new Date('2023-06-20T10:00:00'),
      completedAt: new Date('2023-06-20T10:15:00'),
      stats: {
        sent: 50,
        delivered: 48,
        opened: 25,
        clicked: 10,
        bounced: 2,
        unsubscribed: 1,
        complained: 0,
        openRate: 52.08,
        clickRate: 20.83,
        bounceRate: 4.0,
        unsubscribeRate: 2.08,
        lastUpdated: new Date('2023-06-21T10:00:00')
      },
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date('2023-06-21')
    },
    {
      id: 'campaign-2',
      name: 'Follow-up Campaign - July 2023',
      subject: 'Following up on our introduction, {{firstName}}',
      fromName: 'John Smith',
      fromEmail: 'john@yourcompany.com',
      replyTo: 'john@yourcompany.com',
      templateId: 'template-2',
      listIds: ['list-1'],
      status: 'sent',
      scheduledAt: new Date('2023-07-05T10:00:00'),
      sentAt: new Date('2023-07-05T10:00:00'),
      completedAt: new Date('2023-07-05T10:10:00'),
      stats: {
        sent: 40,
        delivered: 40,
        opened: 30,
        clicked: 15,
        bounced: 0,
        unsubscribed: 2,
        complained: 0,
        openRate: 75.0,
        clickRate: 37.5,
        bounceRate: 0.0,
        unsubscribeRate: 5.0,
        lastUpdated: new Date('2023-07-06T10:00:00')
      },
      createdAt: new Date('2023-07-01'),
      updatedAt: new Date('2023-07-06')
    },
    {
      id: 'campaign-3',
      name: 'July Newsletter',
      subject: 'Your Monthly Update from [Your Company]',
      fromName: 'Your Company',
      fromEmail: 'newsletter@yourcompany.com',
      templateId: 'template-3',
      listIds: ['list-1', 'list-2'],
      status: 'scheduled',
      scheduledAt: new Date('2023-07-25T09:00:00'),
      createdAt: new Date('2023-07-15'),
      updatedAt: new Date('2023-07-15')
    }
  ];
}

export function getMockEmailEvents(): EmailEvent[] {
  return [
    {
      id: 'event-1',
      campaignId: 'campaign-1',
      contactId: 'contact-1',
      type: 'sent',
      timestamp: new Date('2023-06-20T10:00:00')
    },
    {
      id: 'event-2',
      campaignId: 'campaign-1',
      contactId: 'contact-1',
      type: 'delivered',
      timestamp: new Date('2023-06-20T10:00:05')
    },
    {
      id: 'event-3',
      campaignId: 'campaign-1',
      contactId: 'contact-1',
      type: 'opened',
      timestamp: new Date('2023-06-20T10:30:00'),
      metadata: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip: '192.168.1.1',
        device: 'desktop'
      }
    },
    {
      id: 'event-4',
      campaignId: 'campaign-1',
      contactId: 'contact-1',
      type: 'clicked',
      timestamp: new Date('2023-06-20T10:31:00'),
      metadata: {
        url: 'https://yourcompany.com/services',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip: '192.168.1.1',
        device: 'desktop'
      }
    },
    {
      id: 'event-5',
      campaignId: 'campaign-1',
      contactId: 'contact-2',
      type: 'sent',
      timestamp: new Date('2023-06-20T10:00:00')
    },
    {
      id: 'event-6',
      campaignId: 'campaign-1',
      contactId: 'contact-2',
      type: 'delivered',
      timestamp: new Date('2023-06-20T10:00:03')
    },
    {
      id: 'event-7',
      campaignId: 'campaign-1',
      contactId: 'contact-2',
      type: 'opened',
      timestamp: new Date('2023-06-20T11:15:00'),
      metadata: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
        ip: '192.168.1.2',
        device: 'mobile'
      }
    }
  ];
}

// Email Analytics Data
export interface EmailPerformanceData {
  date: string;
  sent: number;
  opened: number;
  clicked: number;
}

export function getMockEmailPerformance(): EmailPerformanceData[] {
  return [
    { date: 'Jun 1', sent: 30, opened: 15, clicked: 5 },
    { date: 'Jun 8', sent: 40, opened: 22, clicked: 8 },
    { date: 'Jun 15', sent: 35, opened: 18, clicked: 7 },
    { date: 'Jun 22', sent: 50, opened: 25, clicked: 10 },
    { date: 'Jun 29', sent: 45, opened: 28, clicked: 12 },
    { date: 'Jul 6', sent: 40, opened: 30, clicked: 15 },
    { date: 'Jul 13', sent: 55, opened: 35, clicked: 18 },
    { date: 'Jul 20', sent: 60, opened: 40, clicked: 22 },
  ];
}
