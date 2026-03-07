/**
 * SessionCard (Group card) — pixel-perfect from Figma node 4509:269909
 * 372x224, gradient bg + accent border, p-[18px], gap-[10px], rounded-[8px]
 * Header: game icon (52px) + team name (18px semibold) + "By Owner | Game"
 * Info: slots | availability | time
 * Skill requirement badge
 * Two action buttons: outline + primary
 */

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons";
import { Users, Clock, Shield, ArrowRight } from "lucide-react";
import { type ReactNode } from "react";

interface SessionCardProps {
  gameIcon?: ReactNode;
  gameColor?: string;
  teamName: string;
  teamAvatar?: string;
  owner: string;
  game: string;
  slotsUsed: number;
  slotsTotal: number;
  availability?: string;
  time?: string;
  skillRequirement?: string;
  onDetails?: () => void;
  onJoin?: () => void;
  className?: string;
}

export function SessionCard({
  gameIcon,
  gameColor = "#FF5252",
  teamName,
  teamAvatar,
  owner,
  game,
  slotsUsed,
  slotsTotal,
  availability,
  time,
  skillRequirement,
  onDetails,
  onJoin,
  className,
}: SessionCardProps) {
  const slotsAvailable = slotsTotal - slotsUsed;

  return (
    <div
      className={cn(
        "flex flex-col gap-[10px] p-[18px] rounded-[var(--radius-md)]",
        "bg-gradient-to-b from-[rgba(153,249,234,0.02)] to-[rgba(153,249,234,0.08)]",
        "border border-accent hover:border-accent transition-colors",
        className
      )}
    >
      {/* Header: Game icon + Team info */}
      <div className="flex gap-2 items-start w-full">
        {/* Game icon */}
        <div
          className="size-[52px] rounded-[4px] shrink-0 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: gameColor }}
        >
          {gameIcon}
        </div>

        {/* Team info */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Team name with avatar */}
          <div className="flex items-center gap-1.5">
            {teamAvatar && (
              <img
                src={teamAvatar}
                alt=""
                className="size-6 rounded-full object-cover shrink-0"
              />
            )}
            <span className="text-lg font-semibold text-white leading-7 truncate">
              {teamName}
            </span>
          </div>

          {/* Owner | Game */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm leading-6 whitespace-nowrap">
              <span className="text-text-secondary">By</span>
              <span className="text-accent font-medium">{owner}</span>
            </div>
            <div className="flex h-2 items-center justify-center w-0">
              <div className="w-2 h-px bg-border-default rotate-90" />
            </div>
            <div className="flex items-center gap-1 text-sm leading-6 whitespace-nowrap">
              {gameIcon && (
                <span className="size-4 flex items-center justify-center text-text-secondary">
                  {gameIcon}
                </span>
              )}
              <span className="text-white">{game}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />

      {/* Info row: Slots | Availability | Time */}
      <div className="flex items-center gap-3 text-sm leading-6">
        <div className="flex items-center gap-1">
          <Users size={16} className="text-white" />
          <span className="font-medium text-white">
            {slotsUsed}/{slotsTotal}
          </span>
        </div>

        {slotsAvailable > 0 && (
          <>
            <div className="flex h-2 items-center justify-center w-0">
              <div className="w-2 h-px bg-border-default rotate-90" />
            </div>
            <span className="text-text-secondary">
              {slotsAvailable} Slot{slotsAvailable !== 1 ? "s" : ""} available
            </span>
          </>
        )}

        {time && (
          <>
            <div className="flex h-2 items-center justify-center w-0">
              <div className="w-2 h-px bg-border-default rotate-90" />
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-text-secondary" />
              <span className="text-text-secondary">{time}</span>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />

      {/* Skill requirement + Actions */}
      <div className="flex flex-col gap-2 w-full">
        {skillRequirement && (
          <div className="flex items-center gap-1 text-sm leading-6">
            <Shield size={16} className="text-white" />
            <span className="text-white">Skill requirement: </span>
            <span className="text-accent font-medium">{skillRequirement}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-[18px] w-full">
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            onClick={onDetails}
          >
            Session details
          </Button>
          <Button
            size="md"
            className="flex-1 bg-[#d7feed] text-[#121415] hover:bg-[#c2fde9]"
            rightIcon={<ArrowRight size={16} />}
            onClick={onJoin}
          >
            Join now
          </Button>
        </div>
      </div>
    </div>
  );
}
