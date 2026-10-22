import { Award, Crown, Medal } from "lucide-react";

export function DefaultRankIcon({ rank }) {
  return (
    <div className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center bg-[#1E2939] border border-white/10 rounded-full text-xs md:text-sm font-bold text-[#AAB1BD] leading-0">
      {rank}
    </div>
  );
}

export function RankIcon({ rank, hallOfFameMode = true }) {
  if (hallOfFameMode && rank >= 1 && rank <= 3) {
    switch (rank) {
      case 1:
        return (
          <Crown className="h-6 w-6 md:h-7 md:w-7 text-[#FED700] drop-shadow-[0_0_8px_rgba(254,215,0,0.5)]" />
        );
      case 2:
        return <Medal className="h-5 w-5 md:h-6 md:w-6 text-[#D5D8DE]" />;
      case 3:
        return <Award className="h-5 w-5 md:h-6 md:w-6 text-[#FF936B]" />;
    }
  }

  return <DefaultRankIcon rank={rank} />;
}

export function getRankBadgeColor(rank) {
  switch (rank) {
    case 1:
      return "bg-[#FED700] text-[#151C28] font-bold shadow-[0_0_12px_rgba(254,215,0,0.4)] border-0";
    case 2:
      return "bg-[#D5D8DE] text-[#151C28] font-bold border-0";
    case 3:
      return "bg-[#FF936B] text-[#151C28] font-bold border-0";
    default:
      return "bg-[#1E2939] text-[#AAB1BD] border border-white/10";
  }
}
