import { Decision } from '../App';
import { Clock, Users, CheckCircle2 } from 'lucide-react';

interface HomeProps {
  decisions: Decision[];
  onViewDecision: (id: string) => void;
  onCreateNew: () => void;
}

export function Home({ decisions, onViewDecision, onCreateNew }: HomeProps) {
  const activeDecisions = decisions.filter(d => d.status === 'active');
  const finalizedDecisions = decisions.filter(d => d.status === 'finalized');

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl">Decide Together</h1>
          <p className="text-gray-600 text-sm mt-1">Make better decisions as a group</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Empty State */}
        {decisions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="size-12 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">No decisions yet. Create your first group decision!</p>
            <button
              onClick={onCreateNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Create Decision
            </button>
          </div>
        )}

        {/* Active Decisions */}
        {activeDecisions.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-gray-900 flex items-center gap-2">
              <Clock className="size-5 text-blue-600" />
              Active Decisions
            </h2>
            <div className="space-y-3">
              {activeDecisions.map(decision => (
                <button
                  key={decision.id}
                  onClick={() => onViewDecision(decision.id)}
                  className="w-full bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex-1 pr-2">{decision.title}</h3>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full whitespace-nowrap">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{decision.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="size-4" />
                      {decision.sharedWith.length} members
                    </span>
                    <span>{decision.options.length} options</span>
                    <span className="ml-auto">{formatDate(decision.createdAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Finalized Decisions */}
        {finalizedDecisions.length > 0 && (
          <div>
            <h2 className="mb-3 text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" />
              Finalized
            </h2>
            <div className="space-y-3">
              {finalizedDecisions.map(decision => (
                <button
                  key={decision.id}
                  onClick={() => onViewDecision(decision.id)}
                  className="w-full bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors text-left opacity-75"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="flex-1 pr-2">{decision.title}</h3>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full whitespace-nowrap">
                      Decided
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="text-green-700">✓</span> {decision.finalDecision}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="size-4" />
                      {decision.sharedWith.length} members
                    </span>
                    <span className="ml-auto">{formatDate(decision.createdAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
