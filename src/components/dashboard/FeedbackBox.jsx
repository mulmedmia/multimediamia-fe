import { MessageSquare } from "lucide-react";

export function FeedbackBox({ title = "", feedback = "", fallback = "" }) {
  return (
    <div className="p-4 sm:p-5 bg-primary/10 border border-primary/25 rounded-2xl space-y-1.5 backdrop-blur-xs">
      <div className="flex items-start gap-2.5">
        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-primary">
            {title}
          </p>
          {feedback ? (
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed mt-1 font-normal break-words">
              {feedback}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed mt-1">
              {fallback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
