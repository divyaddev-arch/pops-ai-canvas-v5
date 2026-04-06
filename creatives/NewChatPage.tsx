import React, { useState, useEffect } from 'react';
import { UnifiedLayout } from '../packages/ue/UnifiedLayout';
import { ChatView } from '../packages/ue/ChatView';

// Mock data imports
import personData from '../person_mock_data.json';
import expectationsData from '../expectations_mock_data.json';
import ratingsData from '../ratings_mock_data.json';
import okrData from '../okr_mock_data.json';

const NewChatPage: React.FC = () => {
  const [resolvedSystemInstruction, setResolvedSystemInstruction] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Resolve data for Divya (mapping to richardmccoll in mock data)
    const targetUsername = 'richardmccoll';
    const user = personData.find(p => p.username === targetUsername);
    const userExpectations = expectationsData.filter(e => e.owner === 100);
    const userRatings = ratingsData.filter(r => r.subject_person_username === targetUsername);
    const userOkrs = okrData.okrs.filter(o => o.owner === targetUsername);

    const userName = "Divya"; 
    const userRole = user?.work?.preferred_title || "Senior Director";
    const userTeam = okrData.team || "Google AI & Cloud Leadership";
    
    const expectationsStr = userExpectations.map(e => `- ${e.title}: ${e.description}`).join('\n');
    const ratingsStr = userRatings.map(r => `- Period ${r.review_period_id}: ${r.rating}`).join('\n');
    const okrsStr = userOkrs.map(o => `- ${o.title} (Priority: ${o.priority})`).join('\n');

    const systemInstructionTemplate = `
You are a Supportive Mentor Agent tailored for {{USER_NAME}}. Your goal is to provide empathetic, warm, and encouraging guidance focused on long-term growth, psychological safety, and personal well-being. 

### Persona Guidelines:
- Use warm and calming language. 
- Focus on the 'human' side of leadership and engineering.
- Prioritize 1:1 conversation preparation and reflection.
- Celebrate successes and provide a safe space for discussing challenges.

### Dynamic Context:
- Address the user as {{USER_NAME}}.
- Reference their role as {{USER_ROLE}} in {{USER_TEAM}}.
- Use {{USER_EXPECTATIONS}}, {{USER_RATINGS}}, and {{USER_OKRS}} to provide context-aware coaching and growth suggestions.
`;

    const resolved = systemInstructionTemplate
      .replace(/{{USER_NAME}}/g, userName)
      .replace(/{{USER_ROLE}}/g, userRole)
      .replace(/{{USER_TEAM}}/g, userTeam)
      .replace(/{{USER_EXPECTATIONS}}/g, expectationsStr)
      .replace(/{{USER_RATINGS}}/g, ratingsStr)
      .replace(/{{USER_OKRS}}/g, okrsStr);

    setResolvedSystemInstruction(resolved);
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <UnifiedLayout 
      activeId="new-chat" 
      userName="Divya"
      systemInstruction={resolvedSystemInstruction}
    >
      <ChatView userName="Divya" systemInstruction={resolvedSystemInstruction} />
    </UnifiedLayout>
  );
};

export default NewChatPage;
