import { useState } from 'react';
import { Decision, Option } from '../App';
import { ThumbsUp, AlertCircle, HelpCircle, MessageCircle, Check } from 'lucide-react';

interface OptionCardProps {
  option: Option;
  decision: Decision;
  onUpdate: (decision: Decision) => void;
  currentUser: string;
  isFinalized: boolean;
}

export function OptionCard({ option, decision, onUpdate, currentUser, isFinalized }: OptionCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userVoted, setUserVoted] = useState(false);

  const handleReaction = (type: 'likes' | 'concerns' | 'questions') => {
    const updatedOptions = decision.options.map(opt => {
      if (opt.id === option.id) {
        return {
          ...opt,
          reactions: {
            ...opt.reactions,
            [type]: opt.reactions[type] + 1
          }
        };
      }
      return opt;
    });

    onUpdate({
      ...decision,
      options: updatedOptions
    });
  };

  const handleVote = () => {
    if (isFinalized || userVoted) return;

    const updatedOptions = decision.options.map(opt => {
      if (opt.id === option.id) {
        return {
          ...opt,
          votes: opt.votes + 1
        };
      }
      return opt;
    });

    onUpdate({
      ...decision,
      options: updatedOptions
    });
    
    setUserVoted(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const updatedOptions = decision.options.map(opt => {
      if (opt.id === option.id) {
        return {
          ...opt,
          comments: [
            ...opt.comments,
            {
              id: Date.now().toString(),
              author: currentUser,
              text: newComment.trim(),
              timestamp: new Date()
            }
          ]
        };
      }
      return opt;
    });

    onUpdate({
      ...decision,
      options: updatedOptions
    });

    setNewComment('');
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
    return `${days}d ago`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Option Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="flex-1 pr-2">{option.text}</h3>
          {userVoted && (
            <span className="text-green-600 flex items-center gap-1 text-sm whitespace-nowrap">
              <Check className="size-4" />
              Voted
            </span>
          )}
        </div>

        {/* Vote Button */}
        {!isFinalized && (
          <button
            onClick={handleVote}
            disabled={userVoted}
            className={`w-full py-2 px-4 border-2 rounded-lg mb-3 transition-colors ${
              userVoted
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          >
            {userVoted ? 'You voted for this' : 'Vote for this option'}
          </button>
        )}

        {/* Reactions */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => handleReaction('likes')}
            disabled={isFinalized}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors disabled:opacity-50"
          >
            <ThumbsUp className="size-4 text-green-600" />
            <span>{option.reactions.likes}</span>
          </button>
          <button
            onClick={() => handleReaction('concerns')}
            disabled={isFinalized}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors disabled:opacity-50"
          >
            <AlertCircle className="size-4 text-orange-600" />
            <span>{option.reactions.concerns}</span>
          </button>
          <button
            onClick={() => handleReaction('questions')}
            disabled={isFinalized}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors disabled:opacity-50"
          >
            <HelpCircle className="size-4 text-blue-600" />
            <span>{option.reactions.questions}</span>
          </button>
        </div>

        {/* Comments Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm text-gray-600"
        >
          <MessageCircle className="size-4" />
          {option.comments.length} {option.comments.length === 1 ? 'comment' : 'comments'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          {option.comments.length > 0 && (
            <div className="space-y-3 mb-3">
              {option.comments.map(comment => (
                <div key={comment.id} className="bg-white rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          {!isFinalized && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}