import { useState } from 'react';
import { Decision } from '../App';
import { ArrowLeft, Plus, X, UserPlus } from 'lucide-react';

interface CreateDecisionProps {
  onBack: () => void;
  onCreate: (decision: Decision) => void;
  currentUser: string;
}

export function CreateDecision({ onBack, onCreate, currentUser }: CreateDecisionProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [members, setMembers] = useState<string[]>([currentUser]);
  const [newMember, setNewMember] = useState('');
  const [showMemberInput, setShowMemberInput] = useState(false);
  const [blindVoting, setBlindVoting] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setNewMember('');
      setShowMemberInput(false);
    }
  };

  const handleRemoveMember = (member: string) => {
    if (member !== currentUser) {
      setMembers(members.filter(m => m !== member));
    }
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    
    const filledOptions = options.filter(opt => opt.trim());
    if (filledOptions.length < 2) return;

    const newDecision: Decision = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      creator: currentUser,
      createdAt: new Date(),
      status: 'active',
      sharedWith: members,
      blindVoting: blindVoting,
      options: filledOptions.map((opt, i) => ({
        id: `${Date.now()}-${i}`,
        text: opt,
        votes: 0,
        reactions: { likes: 0, concerns: 0, questions: 0 },
        comments: []
      })),
      discussionComments: []
    };

    onCreate(newDecision);
  };

  const isValid = title.trim() && options.filter(opt => opt.trim()).length >= 2;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-600">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="flex-1">Create Decision</h1>
            <button
              onClick={handleCreate}
              disabled={!isValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-2">Decision Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Weekend Trip Destination"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-2">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more context about this decision..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-2">Options * (minimum 2)</label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="p-3 text-gray-400 hover:text-red-500"
                  >
                    <X className="size-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleAddOption}
            className="mt-3 flex items-center gap-2 text-blue-600 text-sm"
          >
            <Plus className="size-4" />
            Add Option
          </button>
        </div>

        {/* Share with Members */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-2">Share with</label>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {members.map(member => (
                <div
                  key={member}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {member}
                  {member !== currentUser && (
                    <button
                      onClick={() => handleRemoveMember(member)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {showMemberInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                  placeholder="Enter name or email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowMemberInput(true)}
                className="flex items-center gap-2 text-blue-600 text-sm"
              >
                <UserPlus className="size-4" />
                Add Member
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            All members can view, vote, react, and comment on this decision
          </p>
        </div>

        {/* Blind Voting */}
        <div className="mb-6">
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={blindVoting}
                onChange={(e) => setBlindVoting(e.target.checked)}
                className="mt-0.5 size-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="block text-gray-900">Enable blind voting</span>
                <span className="block text-xs text-gray-600 mt-1">
                  Vote counts will be hidden until the decision is finalized. This encourages independent thinking without influence from others' votes.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}