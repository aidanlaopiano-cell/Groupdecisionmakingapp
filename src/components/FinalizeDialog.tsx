import { useState } from 'react';
import { Decision } from '../App';
import { X, Trophy } from 'lucide-react';

interface FinalizeDialogProps {
  decision: Decision;
  onClose: () => void;
  onFinalize: (optionId: string) => void;
}

export function FinalizeDialog({ decision, onClose, onFinalize }: FinalizeDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Sort options by votes
  const sortedOptions = [...decision.options].sort((a, b) => b.votes - a.votes);
  const topOption = sortedOptions[0];
  const totalVotes = decision.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleConfirm = () => {
    if (selectedOption) {
      onFinalize(selectedOption);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="flex items-center gap-2">
            <Trophy className="size-5 text-yellow-600" />
            Finalize Decision
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Select the final decision for "{decision.title}". This action cannot be undone.
          </p>

          {/* Recommended */}
          {totalVotes > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800 mb-2">
                <span>🏆</span> Most voted option:
              </p>
              <p className="">{topOption.text}</p>
              <p className="text-sm text-yellow-700 mt-1">
                {topOption.votes} votes ({Math.round((topOption.votes / totalVotes) * 100)}%)
              </p>
            </div>
          )}

          {/* Options */}
          <div className="space-y-2 mb-6">
            {sortedOptions.map(option => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                    selectedOption === option.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="">{option.text}</span>
                    <div
                      className={`size-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedOption === option.id && (
                        <div className="size-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  {totalVotes > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{option.votes} votes</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Final Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
