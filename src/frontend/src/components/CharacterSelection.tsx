import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Castle,
  ChevronRight,
  Crown,
  Edit,
  Play,
  Plus,
  RotateCw,
  Shield,
  Swords,
  Trash2,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDeleteCharacter, useGetCharacterSlots } from "../hooks/useQueries";
import type { Character, UserProfile } from "../types/gameTypes";
import BloodParticles from "./BloodParticles";

interface CharacterSelectionProps {
  userProfile: UserProfile;
  onCreateCharacter: (slot: number) => void;
  onEditCharacter: (slot: number, character: Character) => void;
  onPlayCharacter: (character: Character, slot: number) => void;
}

type ViewDirection = "front" | "back" | "left" | "right";
type ChessPieceType = "king" | "queen" | "pawn" | "rook" | "bishop" | "knight";

// XP formula: level N→N+1 requires 100 * 2^(N-1)
function xpForLevel(level: number): number {
  return 100 * 2 ** (level - 1);
}
function cumulativeXpAtLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) total += xpForLevel(l);
  return total;
}

const CHESS_PIECE_PATTERNS: Record<
  ChessPieceType,
  Record<ViewDirection, number[][]>
> = {
  king: {
    front: [
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 1, 1, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    back: [
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    left: [
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    right: [
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
  },
  queen: {
    front: [
      [0, 1, 0, 1, 1, 0, 1, 0],
      [1, 2, 1, 2, 2, 1, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    back: [
      [0, 1, 0, 1, 1, 0, 1, 0],
      [1, 2, 1, 2, 2, 1, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    left: [
      [0, 1, 0, 1, 1, 0, 1, 0],
      [1, 2, 1, 2, 2, 1, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    right: [
      [0, 1, 0, 1, 1, 0, 1, 0],
      [1, 2, 1, 2, 2, 1, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
  },
  pawn: {
    front: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    back: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    left: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    right: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
  },
  rook: {
    front: [
      [1, 0, 1, 0, 0, 1, 0, 1],
      [2, 1, 2, 1, 1, 2, 1, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    back: [
      [1, 0, 1, 0, 0, 1, 0, 1],
      [2, 1, 2, 1, 1, 2, 1, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    left: [
      [1, 0, 1, 0, 0, 1, 0, 1],
      [2, 1, 2, 1, 1, 2, 1, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    right: [
      [1, 0, 1, 0, 0, 1, 0, 1],
      [2, 1, 2, 1, 1, 2, 1, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
  },
  bishop: {
    front: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 1, 1, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    back: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    left: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    right: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
  },
  knight: {
    front: [
      [0, 0, 1, 2, 1, 0, 0, 0],
      [0, 1, 2, 2, 2, 1, 0, 0],
      [1, 2, 2, 1, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    back: [
      [0, 0, 0, 1, 2, 1, 0, 0],
      [0, 0, 1, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 1, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    left: [
      [0, 0, 1, 2, 1, 0, 0, 0],
      [0, 1, 2, 2, 2, 1, 0, 0],
      [1, 2, 2, 1, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
    right: [
      [0, 0, 0, 1, 2, 1, 0, 0],
      [0, 0, 1, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 1, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
    ],
  },
};

const VIEWS: ViewDirection[] = ["front", "right", "back", "left"];

// ---- Sub-components ----

const CharacterPreview: React.FC<{
  character: Character;
  size?: number;
  view?: ViewDirection;
}> = ({ character, size = 120, view = "front" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Render at 2x internal resolution for crispness, scale down with CSS
  const internalSize = size * 2;

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1e30";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pieceType = (character.pieceType || "king") as ChessPieceType;
    const pattern =
      CHESS_PIECE_PATTERNS[pieceType]?.[view] ??
      CHESS_PIECE_PATTERNS.king.front;
    const primary = (character.colors?.[0] as string) || "#F5F5F5";
    const secondary = (character.colors?.[1] as string) || "#D3D3D3";
    const accent = (character.colors?.[2] as string) || "#111111";

    const pixelSize = Math.floor(internalSize / 10);
    const patternW = pattern[0].length * pixelSize;
    const patternH = pattern.length * pixelSize;
    const startX = Math.floor((canvas.width - patternW) / 2);
    const startY = Math.floor((canvas.height - patternH) / 2);

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        const v = pattern[row][col];
        if (v === 0) continue;
        ctx.fillStyle = v === 1 ? secondary : v === 2 ? primary : accent;
        ctx.fillRect(
          startX + col * pixelSize,
          startY + row * pixelSize,
          pixelSize,
          pixelSize,
        );
        ctx.strokeStyle = "rgba(0,0,0,0.55)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(
          startX + col * pixelSize,
          startY + row * pixelSize,
          pixelSize,
          pixelSize,
        );
      }
    }
  }, [character, view, internalSize]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  return (
    <canvas
      ref={canvasRef}
      width={internalSize}
      height={internalSize}
      style={{
        imageRendering: "pixelated",
        display: "block",
        width: size,
        height: size,
      }}
    />
  );
};

const XpBar: React.FC<{ experience: bigint; level: bigint }> = ({
  experience,
  level,
}) => {
  const lvl = Number(level);
  const xp = Number(experience);
  const cumulativeStart = cumulativeXpAtLevel(lvl);
  const needed = xpForLevel(lvl);
  const progressXp = Math.max(0, xp - cumulativeStart);
  const pct = Math.min(100, Math.max(0, (progressXp / needed) * 100));

  return (
    <div style={{ padding: "6px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#e74c3c",
            background: "rgba(200,150,42,0.12)",
            border: "1px solid #8b1a1a",
            borderRadius: 3,
            padding: "1px 6px",
          }}
        >
          LV {lvl}
        </span>
        <span
          style={{ color: "#a55eea", fontSize: 10, fontFamily: "monospace" }}
        >
          {progressXp.toLocaleString()} / {needed.toLocaleString()} XP
        </span>
      </div>
      <div className="dofus-xp-bar">
        <div className="dofus-xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const _getPieceIcon = (pieceType: string) => {
  switch (pieceType?.toLowerCase()) {
    case "king":
      return <Crown className="w-5 h-5" />;
    case "queen":
      return <Shield className="w-5 h-5" />;
    case "rook":
      return <Castle className="w-5 h-5" />;
    case "bishop":
      return <Zap className="w-5 h-5" />;
    case "knight":
      return <ChevronRight className="w-5 h-5" />;
    case "pawn":
      return <Swords className="w-5 h-5" />;
    default:
      return <Crown className="w-5 h-5" />;
  }
};

interface SlotCardProps {
  slotNumber: number;
  character: Character | null;
  viewIndex: number;
  onRotate: () => void;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreate: () => void;
  isDeleting: boolean;
}

const SlotCard: React.FC<SlotCardProps> = React.memo(
  ({
    slotNumber,
    character,
    viewIndex,
    onRotate,
    onPlay,
    onEdit,
    onDelete,
    onCreate,
    isDeleting,
  }) => {
    const view = VIEWS[viewIndex];
    const [hovered, setHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: character
            ? "linear-gradient(160deg,#171b2e 0%,#0d0f1a 60%,#101420 100%)"
            : "linear-gradient(160deg,#0f1220 0%,#0d0f1a 100%)",
          border: character
            ? `1px solid ${hovered ? "#c0392b" : "rgba(200,150,42,0.38)"}`
            : "1px dashed #2a3040",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: character
            ? hovered
              ? "0 0 36px rgba(192,57,43,0.28), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(192,57,43,0.18)"
              : "0 0 18px rgba(200,150,42,0.12), 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(200,150,42,0.07)"
            : hovered
              ? "0 0 16px rgba(200,150,42,0.06)"
              : "0 4px 12px rgba(0,0,0,0.3)",
          transition: "box-shadow 0.25s, border-color 0.25s, background 0.25s",
          position: "relative",
        }}
      >
        {/* Top gold accent line */}
        {character && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: 2,
              background: hovered
                ? "linear-gradient(90deg,transparent,#c0392b,transparent)"
                : "linear-gradient(90deg,transparent,#8b1a1a,transparent)",
              transition: "background 0.25s",
            }}
          />
        )}

        {/* Slot header */}
        <div
          style={{
            background: "linear-gradient(90deg,#1a1e30 0%,#0d0f1a 100%)",
            borderBottom: "1px solid #1e2436",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "#6a7a8a",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            \u2694 Slot {slotNumber}
          </span>
          {character && (
            <div
              style={{
                background: "rgba(200,150,42,0.15)",
                border: "1px solid #8b1a1a",
                borderRadius: 5,
                padding: "2px 9px",
                color: "#e74c3c",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.08em",
              }}
            >
              LVL {character.level?.toString()}
            </div>
          )}
        </div>

        <div style={{ padding: "16px 16px 20px" }}>
          {character ? (
            <FilledSlot
              character={character}
              view={view}
              onRotate={onRotate}
              onPlay={onPlay}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ) : (
            <EmptySlot onCreate={onCreate} />
          )}
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.slotNumber === next.slotNumber &&
    prev.character === next.character &&
    prev.viewIndex === next.viewIndex &&
    prev.isDeleting === next.isDeleting &&
    prev.onRotate === next.onRotate &&
    prev.onPlay === next.onPlay &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete &&
    prev.onCreate === next.onCreate,
);

const FilledSlot: React.FC<{
  character: Character;
  view: ViewDirection;
  onRotate: () => void;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}> = ({ character, view, onRotate, onPlay, onEdit, onDelete, isDeleting }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {/* Preview row */}
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        {/* Gold glow frame */}
        <div
          style={{
            width: 112,
            height: 112,
            border: "2px solid #c0392b",
            borderRadius: 10,
            overflow: "hidden",
            background: "#0a0c14",
            boxShadow:
              "0 0 18px rgba(192,57,43,0.35), inset 0 0 10px rgba(192,57,43,0.1)",
            position: "relative",
          }}
        >
          <CharacterPreview character={character} size={112} view={view} />
          {/* Corner accents */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderStyle: "solid",
                borderColor: "#c0392b",
                borderWidth: "1.5px",
                borderRight: i % 2 === 0 ? "none" : "1.5px solid #c0392b",
                borderLeft: i % 2 === 1 ? "none" : "1.5px solid #c0392b",
                borderBottom: i < 2 ? "none" : "1.5px solid #c0392b",
                borderTop: i >= 2 ? "none" : "1.5px solid #c0392b",
                top: i < 2 ? 2 : undefined,
                bottom: i >= 2 ? 2 : undefined,
                left: i % 2 === 0 ? 2 : undefined,
                right: i % 2 === 1 ? 2 : undefined,
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onRotate}
          title="Rotate view"
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 24,
            height: 24,
            background: "#141726",
            border: "1px solid #c0392b",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e74c3c",
            boxShadow: "0 0 6px rgba(192,57,43,0.3)",
          }}
        >
          <RotateCw style={{ width: 11, height: 11 }} />
        </button>
        <div
          style={{
            position: "absolute",
            bottom: -10,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "#e74c3c",
              background: "#0d0f1a",
              padding: "2px 6px",
              borderRadius: 3,
              border: "1px solid #8b1a1a",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {view}
          </span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <span style={{ color: "#c0392b", fontSize: 18 }}>
            {character.pieceType === "king" && "\u2654"}
            {character.pieceType === "queen" && "\u2655"}
            {character.pieceType === "pawn" && "\u2659"}
            {character.pieceType === "rook" && "\u2656"}
            {character.pieceType === "bishop" && "\u2657"}
            {character.pieceType === "knight" && "\u2658"}
          </span>
          <span
            style={{
              color: "#e74c3c",
              fontWeight: 800,
              fontSize: 16,
              fontFamily: "serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textShadow: "0 0 10px rgba(240,192,96,0.4)",
            }}
          >
            {character.name}
          </span>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(192,57,43,0.1)",
            border: "1px solid #8b1a1a",
            borderRadius: 4,
            padding: "2px 8px",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "#6a7a8a",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {character.pieceType}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          {(character.colors as string[] | undefined)
            ?.slice(0, 3)
            .map((c: string, i: number) => (
              <div
                key={`color-${i}-${c}`}
                title={c}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: c,
                  border: "1px solid rgba(192,57,43,0.3)",
                  boxShadow: `0 0 4px ${c}55`,
                }}
              />
            ))}
        </div>
      </div>
    </div>

    {/* XP bar */}
    <XpBar
      experience={character.experience ?? BigInt(0)}
      level={character.level ?? BigInt(1)}
    />

    {/* Stats grid */}
    <div
      style={{
        position: "relative",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(192,57,43,0.1)",
        borderRadius: 8,
        padding: "8px 10px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "5px 10px",
        overflow: "hidden",
      }}
    >
      <BloodParticles intensity="subtle" />
      {[
        {
          label: "HP",
          value: character.stats?.hp?.toString() ?? "100",
          color: "#e74c3c",
          icon: "♥",
        },
        {
          label: "AP",
          value: character.stats?.ap?.toString() ?? "10",
          color: "#5b9cf0",
          icon: "⚡",
        },
        {
          label: "MP",
          value: character.stats?.mp?.toString() ?? "5",
          color: "#27ae60",
          icon: "◈",
        },
        {
          label: "INIT",
          value:
            (character.stats?.init ?? character.stats?.atk)?.toString() ?? "10",
          color: "#f39c12",
          icon: "★",
        },
      ].map(({ label, value, color, icon }) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: `${color}12`,
            border: `1px solid ${color}22`,
            borderRadius: 5,
            padding: "3px 7px",
          }}
        >
          <span style={{ color, fontSize: 11, lineHeight: 1 }}>{icon}</span>
          <span
            style={{
              color: "#6a7a8a",
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              flex: 1,
            }}
          >
            {label}
          </span>
          <span
            style={{
              color,
              fontSize: 12,
              fontWeight: 800,
              textShadow: `0 0 6px ${color}88`,
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>

    {/* Actions */}
    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
      <button
        type="button"
        data-ocid="character_selection.play_button"
        onClick={onPlay}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "11px 0",
          borderRadius: 8,
          cursor: "pointer",
          background: "linear-gradient(135deg,#a0721a,#c0392b,#e8b840)",
          border: "1px solid #c0392b",
          color: "#0d0f1a",
          fontWeight: 900,
          fontSize: 13,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          boxShadow:
            "0 0 16px rgba(192,57,43,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
          transition: "box-shadow 0.2s, transform 0.1s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 28px rgba(200,150,42,0.55), inset 0 1px 0 rgba(255,255,255,0.2)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 16px rgba(192,57,43,0.3), inset 0 1px 0 rgba(255,255,255,0.15)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <Play style={{ width: 14, height: 14 }} />
        <span>Play</span>
      </button>
      <button
        type="button"
        data-ocid="character_selection.edit_button"
        onClick={onEdit}
        title="Edit character"
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          cursor: "pointer",
          flexShrink: 0,
          background: "rgba(200,150,42,0.06)",
          border: "1px solid #8b1a1a",
          color: "#c0392b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition:
            "background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.1s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(200,150,42,0.2)";
          e.currentTarget.style.borderColor = "#c0392b";
          e.currentTarget.style.boxShadow = "0 0 10px rgba(192,57,43,0.35)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(200,150,42,0.06)";
          e.currentTarget.style.borderColor = "#8b1a1a";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <Edit style={{ width: 15, height: 15 }} />
      </button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            data-ocid="character_selection.delete_button"
            disabled={isDeleting}
            title="Delete character"
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              cursor: isDeleting ? "not-allowed" : "pointer",
              flexShrink: 0,
              background: "rgba(231,76,60,0.08)",
              border: "1px solid #7a1a1a",
              color: "#e74c3c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isDeleting ? 0.5 : 1,
              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.background = "rgba(231,76,60,0.18)";
                e.currentTarget.style.borderColor = "#e74c3c";
                e.currentTarget.style.boxShadow = "0 0 8px rgba(231,76,60,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(231,76,60,0.08)";
              e.currentTarget.style.borderColor = "#7a1a1a";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isDeleting ? (
              <div
                className="animate-spin"
                style={{
                  width: 14,
                  height: 14,
                  border: "2px solid #e74c3c",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <Trash2 style={{ width: 15, height: 15 }} />
            )}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent
          style={{
            background: "#141726",
            border: "1px solid #8b1a1a",
            boxShadow: "0 0 30px rgba(200,150,42,0.2)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "#e74c3c", fontFamily: "serif" }}>
              Delete Character
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#c0ccd8" }}>
              Delete &ldquo;{character.name}&rdquo;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                background: "#1a1e30",
                color: "#c0ccd8",
                border: "1px solid #2a3040",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="character_selection.delete_confirm_button"
              onClick={onDelete}
              style={{
                background: "linear-gradient(135deg,#5a1010,#7a1a1a)",
                border: "1px solid #c0392b",
                color: "#fff",
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
);

const EmptySlot: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "36px 16px",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background:
          "radial-gradient(circle,rgba(200,150,42,0.06) 0%,transparent 70%)",
        border: "2px dashed #8b1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 0.2s",
      }}
    >
      <Plus style={{ width: 32, height: 32, color: "#8b1a1a" }} />
    </div>
    <p
      style={{
        color: "#6a7a8a",
        fontSize: 12,
        margin: 0,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontWeight: 600,
      }}
    >
      Empty Slot
    </p>
    <button
      type="button"
      data-ocid="character_selection.create_button"
      onClick={onCreate}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "11px 28px",
        borderRadius: 8,
        cursor: "pointer",
        background: "linear-gradient(135deg,#1a1e30,#141726)",
        border: "1px solid #8b1a1a",
        color: "#e74c3c",
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: "0.04em",
        width: "100%",
        justifyContent: "center",
        boxShadow: "0 0 10px rgba(192,57,43,0.1)",
        transition: "box-shadow 0.2s, border-color 0.2s, transform 0.1s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 18px rgba(200,150,42,0.28)";
        e.currentTarget.style.borderColor = "#c0392b";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 10px rgba(192,57,43,0.1)";
        e.currentTarget.style.borderColor = "#8b1a1a";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Plus style={{ width: 15, height: 15 }} />
      <span>Create Character</span>
    </button>
  </div>
);

// ---- Main component ----

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  userProfile,
  onCreateCharacter,
  onEditCharacter,
  onPlayCharacter,
}) => {
  const {
    data: characterSlots,
    isLoading,
    isError,
    refetch,
  } = useGetCharacterSlots();
  const deleteCharacterMutation = useDeleteCharacter();
  const [deletingSlot, setDeletingSlot] = useState<number | null>(null);
  const [previewViews, setPreviewViews] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
  });

  const rotatePreview = useCallback(
    (slot: number) =>
      setPreviewViews((prev) => ({
        ...prev,
        [slot]: (prev[slot] + 1) % VIEWS.length,
      })),
    [],
  );

  const handleDeleteCharacter = useCallback(
    async (slot: number) => {
      setDeletingSlot(slot);
      try {
        await deleteCharacterMutation.mutateAsync(BigInt(slot));
      } finally {
        setDeletingSlot(null);
      }
    },
    [deleteCharacterMutation],
  );

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0d0f1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="animate-spin"
            style={{
              width: 56,
              height: 56,
              border: "3px solid #c0392b",
              borderTopColor: "transparent",
              borderRadius: "50%",
              margin: "0 auto 16px",
              boxShadow: "0 0 20px rgba(192,57,43,0.3)",
            }}
          />
          <p
            style={{
              color: "#c0ccd8",
              fontFamily: "serif",
              letterSpacing: "0.06em",
            }}
          >
            Loading character slots\u2026
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0d0f1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{ color: "#e74c3c", fontFamily: "serif", marginBottom: 16 }}
          >
            Failed to load character slots.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            style={{
              padding: "10px 24px",
              background: "transparent",
              border: "2px solid #c0392b",
              borderRadius: 6,
              color: "#e74c3c",
              cursor: "pointer",
              fontFamily: "serif",
              fontSize: 14,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const slots = [
    { number: 1, character: characterSlots?.slot1 ?? null },
    { number: 2, character: characterSlots?.slot2 ?? null },
    { number: 3, character: characterSlots?.slot3 ?? null },
  ];

  return (
    <div
      style={{
        minHeight: "100%",
        width: "100%",
        background: "#0d0f1a",
        overflowY: "auto",
        padding: "36px 24px 40px",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Page header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        {/* Decorative line */}
        <div
          style={{
            width: 180,
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#c0392b,transparent)",
            margin: "0 auto 20px",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 900,
              background:
                "linear-gradient(90deg,#c0392b,#e74c3c,#e8b840,#c0392b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "serif",
              letterSpacing: "0.1em",
              margin: 0,
              textShadow: "none",
            }}
          >
            Choose your Paper Baby Vampire!
          </h1>
        </div>
        <p style={{ color: "#6a7a8a", fontSize: 14, margin: 0 }}>
          Welcome,{" "}
          <span
            style={{
              color: "#e74c3c",
              fontWeight: 700,
              textShadow: "0 0 10px rgba(240,192,96,0.3)",
            }}
          >
            {userProfile.name}
          </span>
          . Select a character or create a new one.
        </p>
        <div
          style={{
            width: 180,
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#c0392b,transparent)",
            margin: "20px auto 0",
          }}
        />
      </div>

      {/* 3-slot grid */}
      <div
        data-ocid="character_selection.list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
          gap: 22,
          maxWidth: 1040,
          margin: "0 auto",
        }}
      >
        {slots.map(({ number, character }) => {
          // Stable refs per-slot so React.memo on SlotCard works
          const slotChar = character;
          return (
            <SlotCard
              key={number}
              slotNumber={number}
              character={slotChar}
              viewIndex={previewViews[number]}
              onRotate={() => rotatePreview(number)}
              onPlay={() => slotChar && onPlayCharacter(slotChar, number)}
              onEdit={() => slotChar && onEditCharacter(number, slotChar)}
              onDelete={() => handleDeleteCharacter(number)}
              onCreate={() => onCreateCharacter(number)}
              isDeleting={deletingSlot === number}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CharacterSelection;
