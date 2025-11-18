import { useState } from 'react';
import { Decision } from '../App';
import { Send } from 'lucide-react';

interface DiscussionTabProps {
  decision: Decision;
  onUpdate: (decision: Decision) => void;
  currentUser: string;
}

export function DiscussionTab({ decision, onUpdate, currentUser }: DiscussionTabProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedDecision = {
      ...decision,
      discussionComments: [
        ...decision.discussionComments,
        {
          id: Date.now().toString(),
          author: currentUser,
          text: newMessage.trim(),
          timestamp: new Date()
        }
      ]
    };

    onUpdate(updatedDecision);
    setNewMessage('');
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          Use this space to discuss the decision with group members. Share thoughts, ask questions, and work together to reach consensus.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 mb-4">
        {decision.discussionComments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet. Start the discussion!</p>
          </div>
        ) : (
          decision.discussionComments.map(comment => (
            <div
              key={comment.id}
              className={`flex ${comment.author === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  comment.author === currentUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-sm ${
                      comment.author === currentUser ? 'text-blue-100' : 'text-gray-900'
                    }`}
                  >
                    {comment.author}
                  </span>
                  <span
                    className={`text-xs ${
                      comment.author === currentUser ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {formatTimestamp(comment.timestamp)}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    comment.author === currentUser ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      {decision.status === 'active' && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 -mx-4 px-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
