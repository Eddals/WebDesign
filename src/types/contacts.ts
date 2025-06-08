export type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export interface Contact {
    id: string;
    created_at: string;
    updated_at: string;
    
    // Contact Information
    full_name: string;
    email: string;
    phone?: string;
    company?: string;
    
    // Contact Details
    contact_reason?: string;
    project_type?: string;
    budget?: string;
    timeline?: string;
    message: string;
    preferred_contact?: string;
    
    // Message Details
    subject?: string;
    
    // Status and Metadata
    status: ContactStatus;
    is_urgent: boolean;
    priority: number;
}