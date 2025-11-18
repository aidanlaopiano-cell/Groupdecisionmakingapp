import { useState } from 'react';
import { Home } from './components/Home';
import { CreateDecision } from './components/CreateDecision';
import { DecisionDetail } from './components/DecisionDetail';
import { Plus, Home as HomeIcon, User } from 'lucide-react';

export interface Option {
  id: string;
  text: string;
  votes: number;
  reactions: {
    likes: number;
    concerns: number;
    questions: number;
  };
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  creator: string;
  createdAt: Date;
  options: Option[];
  status: 'active' | 'finalized';
  sharedWith: string[];
  finalDecision?: string;
  discussionComments: Comment[];
  blindVoting: boolean;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'detail'>('home');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [currentUser] = useState('You');
  
  const [decisions, setDecisions] = useState<Decision[]>([
    {
      id: '1',
      title: 'Weekend Trip Destination',
      description: 'Where should we go for our weekend getaway?',
      creator: 'Sarah',
      createdAt: new Date('2025-11-15'),
      status: 'active',
      sharedWith: ['You', 'Sarah', 'Mike', 'Jessica', 'Tom'],
      options: [
        {
          id: '1a',
          text: 'Beach Resort',
          votes: 3,
          reactions: { likes: 4, concerns: 1, questions: 0 },
          comments: [
            {
              id: 'c1',
              author: 'Mike',
              text: 'Love this idea! The weather should be perfect.',
              timestamp: new Date('2025-11-16T10:30:00')
            },
            {
              id: 'c2',
              author: 'Jessica',
              text: 'Concern about the cost. Any budget-friendly options?',
              timestamp: new Date('2025-11-16T14:20:00')
            }
          ]
        },
        {
          id: '1b',
          text: 'Mountain Cabin',
          votes: 2,
          reactions: { likes: 3, concerns: 0, questions: 1 },
          comments: [
            {
              id: 'c3',
              author: 'Tom',
              text: 'Great for hiking! How far is the drive?',
              timestamp: new Date('2025-11-16T11:00:00')
            }
          ]
        },
        {
          id: '1c',
          text: 'City Exploration',
          votes: 1,
          reactions: { likes: 2, concerns: 2, questions: 0 },
          comments: []
        }
      ],
      discussionComments: [
        {
          id: 'd1',
          author: 'Sarah',
          text: 'Let\'s try to decide by Thursday so we can book!',
          timestamp: new Date('2025-11-15T09:00:00')
        }
      ],
      blindVoting: false
    },
    {
      id: '2',
      title: 'Team Lunch Restaurant',
      description: 'Where should we go for the team lunch next week?',
      creator: 'You',
      createdAt: new Date('2025-11-17'),
      status: 'active',
      sharedWith: ['You', 'Alex', 'Chris', 'Dana'],
      blindVoting: true,
      options: [
        {
          id: '2a',
          text: 'Italian Bistro',
          votes: 2,
          reactions: { likes: 3, concerns: 0, questions: 0 },
          comments: []
        },
        {
          id: '2b',
          text: 'Thai Restaurant',
          votes: 1,
          reactions: { likes: 2, concerns: 1, questions: 0 },
          comments: []
        }
      ],
      discussionComments: []
    }
  ]);

  const handleCreateDecision = (decision: Decision) => {
    setDecisions([decision, ...decisions]);
    setCurrentView('home');
  };

  const handleViewDecision = (id: string) => {
    setSelectedDecisionId(id);
    setCurrentView('detail');
  };

  const handleUpdateDecision = (updatedDecision: Decision) => {
    setDecisions(decisions.map(d => d.id === updatedDecision.id ? updatedDecision : d));
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedDecisionId(null);
  };

  const selectedDecision = decisions.find(d => d.id === selectedDecisionId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Content */}
      <div className="h-full">
        {currentView === 'home' && (
          <Home 
            decisions={decisions} 
            onViewDecision={handleViewDecision}
            onCreateNew={() => setCurrentView('create')}
          />
        )}
        
        {currentView === 'create' && (
          <CreateDecision 
            onBack={handleBack}
            onCreate={handleCreateDecision}
            currentUser={currentUser}
          />
        )}
        
        {currentView === 'detail' && selectedDecision && (
          <DecisionDetail 
            decision={selectedDecision}
            onBack={handleBack}
            onUpdate={handleUpdateDecision}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentView === 'home' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <HomeIcon className="size-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentView('create')}
            className="flex items-center justify-center w-14 h-14 -mt-6 bg-blue-600 rounded-full text-white shadow-lg"
          >
            <Plus className="size-7" />
          </button>
          
          <button
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-500"
          >
            <User className="size-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}