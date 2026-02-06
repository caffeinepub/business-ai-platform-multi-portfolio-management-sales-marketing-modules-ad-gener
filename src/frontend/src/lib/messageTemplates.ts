import type { SalesItem, Campaign } from '../backend';

export function generateMessageTemplate(
  templateType: 'sales-followup' | 'invoice-reminder' | 'customer-winback',
  businessName: string,
  salesItem?: SalesItem,
  campaign?: Campaign
): string {
  const templates = {
    'sales-followup': `Subject: Following Up on Our Conversation

Hi [Customer Name],

I hope this message finds you well! I wanted to follow up on our recent conversation about ${salesItem ? salesItem.name : '[Product/Service]'}.

At ${businessName}, we're committed to helping businesses like yours achieve their goals. ${salesItem ? `The ${salesItem.name} opportunity we discussed` : 'Our solution'} could be a great fit for your needs.

I'd love to schedule a quick call to answer any questions you might have and discuss next steps.

Looking forward to hearing from you!

Best regards,
${businessName} Team`,

    'invoice-reminder': `Subject: Friendly Payment Reminder

Hi [Customer Name],

This is a friendly reminder that invoice #[Invoice Number] for ${salesItem ? `$${salesItem.amount.toFixed(2)}` : '[Amount]'} is due on [Due Date].

You can make your payment through [Payment Method].

If you've already sent payment, please disregard this message. If you have any questions or concerns, please don't hesitate to reach out.

Thank you for your business!

Best regards,
${businessName} Team`,

    'customer-winback': `Subject: We Miss You at ${businessName}!

Hi [Customer Name],

It's been a while since we last connected, and we wanted to reach out to see how you're doing.

At ${businessName}, we've been working hard to improve our offerings and would love to have you back. ${campaign ? `We're currently running a special campaign: ${campaign.name}` : 'We have some exciting new offerings'} that we think you'll find valuable.

We'd love to reconnect and show you what's new. Are you available for a quick call this week?

We hope to hear from you soon!

Warm regards,
${businessName} Team`,
  };

  return templates[templateType];
}
