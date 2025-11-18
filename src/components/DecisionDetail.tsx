import { useState } from "react";
import { Decision } from "../App";
import {
  ArrowLeft,
  Share2,
  MessageCircle,
  Users,
  EyeOff,
} from "lucide-react";
import { OptionCard } from "./OptionCard";
import { DiscussionTab } from "./DiscussionTab";
import { FinalizeDialog } from "./FinalizeDialog";

interface DecisionDetailProps {
  decision: Decision;
  onBack: () => void;
  onUpdate: (decision: Decision) => void;
  currentUser: string;
}

export function DecisionDetail({
  decision,
  onBack,
  onUpdate,
  currentUser,
}: DecisionDetailProps) {
  const [activeTab, setActiveTab] = useState<
    "options" | "discussion"
  >("options");
  const [showFinalizeDialog, setShowFinalizeDialog] =
    useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleShare = () => {
    setShowShareDialog(true);
    // Simulate share functionality
    setTimeout(() => {
      setShowShareDialog(false);
    }, 2000);
  };

  const handleFinalize = (selectedOptionId: string) => {
    const selectedOption = decision.options.find(
      (opt) => opt.id === selectedOptionId,
    );
    if (selectedOption) {
      const updatedDecision = {
        ...decision,
        status: "finalized" as const,
        finalDecision: selectedOption.text,
      };
      onUpdate(updatedDecision);
      setShowFinalizeDialog(false);
    }
  };

  const totalVotes = decision.options.reduce(
    (sum, opt) => sum + opt.votes,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="text-gray-600">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="flex-1 line-clamp-1">
              {decision.title}
            </h1>
            <button
              onClick={handleShare}
              className="text-gray-600"
            >
              <Share2 className="size-5" />
            </button>
          </div>

          {decision.description && (
            <p className="text-sm text-gray-600 mb-3">
              {decision.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Users className="size-4" />
              {decision.sharedWith.length} members
            </span>
            <span>Created by {decision.creator}</span>
          </div>

          {/* Blind Voting Indicator */}
          {decision.blindVoting &&
            decision.status === "active" && (
              <div className="mb-3 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2">
                <EyeOff className="size-4 text-purple-700" />
                <span className="text-xs text-purple-700">
                  Blind voting enabled - votes hidden until
                  finalized
                </span>
              </div>
            )}

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("options")}
              className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
                activeTab === "options"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Options ({decision.options.length})
            </button>
            <button
              onClick={() => setActiveTab("discussion")}
              className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "discussion"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              <MessageCircle className="size-4" />
              Discussion
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {activeTab === "options" ? (
          <>
            {/* Vote Summary */}
            {totalVotes > 0 && !decision.blindVoting && (
              <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Total votes cast: {totalVotes}
                </p>
                <div className="space-y-2">
                  {decision.options
                    .sort((a, b) => b.votes - a.votes)
                    .map((option) => {
                      const percentage =
                        totalVotes > 0
                          ? (option.votes / totalVotes) * 100
                          : 0;
                      return (
                        <div key={option.id}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-700">
                              {option.text}
                            </span>
                            <span className="text-gray-500">
                              {option.votes} votes
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-4">
              {decision.options.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  decision={decision}
                  onUpdate={onUpdate}
                  currentUser={currentUser}
                  isFinalized={decision.status === "finalized"}
                />
              ))}
            </div>

            {/* Finalize Button */}
            {decision.status === "active" &&
              decision.creator === currentUser && (
                <button
                  onClick={() => setShowFinalizeDialog(true)}
                  className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg"
                >
                  Finalize Decision
                </button>
              )}

            {decision.status === "finalized" && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span>✓</span> This decision has been
                  finalized
                </p>
                <p className="mt-1">
                  Final decision: {decision.finalDecision}
                </p>
              </div>
            )}
          </>
        ) : (
          <DiscussionTab
            decision={decision}
            onUpdate={onUpdate}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <p className="text-center">
              Share link copied to clipboard!
            </p>
          </div>
        </div>
      )}

      {/* Finalize Dialog */}
      {showFinalizeDialog && (
        <FinalizeDialog
          decision={decision}
          onClose={() => setShowFinalizeDialog(false)}
          onFinalize={handleFinalize}
        />
      )}
    </div>
  );
}