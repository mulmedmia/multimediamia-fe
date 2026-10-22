import { cn } from "@/lib/utils";
import { getRankBadgeColor, RankIcon } from "./RankIcon";
import { Badge } from "../ui/badge";
import { Zap } from "lucide-react";

export function PodiumCard({ rank = 1, topThree = [] }) {
  if (rank < 1 || rank > 3) return <div>Rank valid hanya 1 - 3</div>;
  if (!Array.isArray(topThree) || topThree.length < rank)
    return (
      <div>Array topThree harus lebih dari atau sama dengan {rank} elemen</div>
    );

  const topThreeIdx = rank - 1;

  const secondRank = rank === 2;
  const firstRank = rank === 1;
  const thirdRank = rank === 3;

  return (
    <div
      className={cn(
        secondRank && "order-2 md:order-1",
        firstRank && "order-1 md:order-2",
        thirdRank && "order-3",
      )}
    >
      <div
        className={cn(
          "bg-gradient-to-b via-[#1E2939]/80 to-[#141824] border rounded-2xl p-6 text-center backdrop-blur-md space-y-4 transition-all",
          secondRank &&
            "from-[#D5D8DE]/15 border-[#D5D8DE]/40 shadow-[0_0_25px_rgba(213,216,222,0.08)] hover:border-[#D5D8DE]/80",
          firstRank &&
            "from-[#FED700]/20 via-[#1E2939]/90 border-2 border-[#FED700] md:p-8 shadow-[0_0_35px_rgba(254,215,0,0.25)] relative md:-translate-y-4",
          thirdRank &&
            "from-[#FF936B]/15 border-[#FF936B]/40 shadow-[0_0_25px_rgba(255,147,107,0.08)] hover:border-[#FF936B]/80",
        )}
      >
        {firstRank && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FED700] text-[#151C28] text-xs font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
            👑 Champion
          </div>
        )}

        <div
          className={cn(
            "flex flex-col items-center gap-2",
            firstRank && "pt-2",
          )}
        >
          <div
            className={cn(
              "p-3 rounded-full bg-[#1E2939] border",
              secondRank && "border-[#D5D8DE]/30",
              firstRank &&
                "p-3.5 border-[#FED700]/50 shadow-[0_0_15px_rgba(254,215,0,0.3)]",
              thirdRank && "border-[#FF936B]/30",
            )}
          >
            <RankIcon rank={rank} />
          </div>
          <Badge className={getRankBadgeColor(rank)}>Rank #{rank}</Badge>
        </div>

        <div className="space-y-1">
          <h3
            className={cn(
              "text-lg md:text-xl font-bold text-[#FFF9F5] truncate",
              firstRank && "text-xl md:text-2xl",
            )}
          >
            {topThree[topThreeIdx].team_name}
          </h3>
          <p
            className={cn(
              "text-xs text-[#AAB1BD] truncate",
              firstRank && "md:text-sm",
            )}
          >
            oleh {topThree[topThreeIdx].user?.name || "Peserta"}
          </p>
          <Badge className={getRankBadgeColor(-1)}>
            {topThree[topThreeIdx].category?.name}
          </Badge>
        </div>

        <div
          className={cn(
            "pt-2 border-t border-white/10 flex items-center justify-center gap-3",
            firstRank && "pt-3",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1.5 font-bold text-amber-400",
              firstRank && "text-[#FED700]",
            )}
          >
            <Zap
              className={cn(
                "h-5 w-5 fill-amber-400",
                firstRank && "h-6 w-6 fill-[#FED700]",
              )}
            />
            <span
              className={cn(
                "text-2xl font-bold text-[#FFF9F5]",
                firstRank && "text-3xl font-extrabold",
              )}
            >
              {topThree[topThreeIdx].xp.toLocaleString()}
            </span>
            <span
              className={cn("text-xs text-[#AAB1BD]", firstRank && "text-sm")}
            >
              XP
            </span>
          </div>
          <span className="text-white/20 select-none">|</span>
          <div
            className={cn(
              "flex items-center gap-1 text-xs text-[#FED700] font-semibold",
              firstRank && "text-sm",
            )}
          >
            <span>💎</span>
            <span>{topThree[topThreeIdx].diamond.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
