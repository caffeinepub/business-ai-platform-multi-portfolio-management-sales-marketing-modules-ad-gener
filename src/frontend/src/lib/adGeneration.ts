interface AdGenerationParams {
  productOrService: string;
  audience: string;
  tone: string;
  channel: string;
}

const toneTemplates: Record<string, string[]> = {
  professional: [
    'Discover how {product} can transform your business.',
    'Elevate your operations with {product}.',
    'Join industry leaders who trust {product}.',
  ],
  casual: [
    'Check out {product} - it\'s pretty awesome!',
    'Hey {audience}, you\'re going to love {product}.',
    '{product} makes things so much easier.',
  ],
  enthusiastic: [
    'Get ready to be amazed by {product}!',
    'This is incredible! {product} is a game-changer!',
    'You won\'t believe what {product} can do!',
  ],
  urgent: [
    'Don\'t miss out on {product} - limited time offer!',
    'Act now! {product} is waiting for you.',
    'Time is running out to experience {product}.',
  ],
  friendly: [
    'We think you\'ll really enjoy {product}.',
    'Let us introduce you to {product}.',
    'We\'re excited to share {product} with you!',
  ],
};

const channelEndings: Record<string, string[]> = {
  'social-media': [
    'Learn more in our bio.',
    'Tap to explore.',
    'Swipe up to get started.',
  ],
  email: [
    'Click here to learn more.',
    'Reply to this email for details.',
    'Visit our website today.',
  ],
  display: [
    'Click to discover more.',
    'Visit us now.',
    'Learn more today.',
  ],
  search: [
    'Get started now.',
    'Try it free.',
    'See how it works.',
  ],
  video: [
    'Watch the full video.',
    'Subscribe for more.',
    'See it in action.',
  ],
};

export function generateAdVariations(params: AdGenerationParams): string[] {
  const { productOrService, audience, tone, channel } = params;
  
  const templates = toneTemplates[tone] || toneTemplates.professional;
  const endings = channelEndings[channel] || channelEndings['social-media'];
  
  const variations: string[] = [];
  
  // Generate 5 variations
  for (let i = 0; i < 5; i++) {
    const template = templates[i % templates.length];
    const ending = endings[i % endings.length];
    
    let variation = template
      .replace('{product}', productOrService)
      .replace('{audience}', audience);
    
    // Add audience-specific intro for some variations
    if (i % 2 === 0) {
      variation = `Attention ${audience}! ${variation}`;
    }
    
    // Add call-to-action
    variation += ` ${ending}`;
    
    // Add benefit statement for some variations
    if (i === 2 || i === 4) {
      const benefits = [
        'Save time and increase productivity.',
        'Join thousands of satisfied customers.',
        'Experience the difference today.',
        'Trusted by professionals worldwide.',
        'Get results you can measure.',
      ];
      variation += ` ${benefits[i % benefits.length]}`;
    }
    
    variations.push(variation);
  }
  
  return variations;
}
