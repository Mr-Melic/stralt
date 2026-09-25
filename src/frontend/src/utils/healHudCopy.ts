/**
 * Overworld Doka-to-HP button copy. Display only — does not change 1:3 math.
 *
 * The visible label already uses the affordable partial heal. The hover title
 * used to quote a full-heal price (hpNeeded / ceil(hpNeeded/3)) even when the
 * wallet can only buy a slice. Keep title and label on the same numbers.
 */

export type OverworldHealButtonCopy = {
  label: string;
  title: string;
};

export function overworldHealButtonCopy(args: {
  canAfford: boolean;
  healHp: number;
  dokaCost: number;
}): OverworldHealButtonCopy {
  if (!args.canAfford) {
    return {
      label: "♥ Heal (Need Doka)",
      title: "Not enough Doka to heal",
    };
  }
  const label = `♥ Heal ${args.healHp} HP → ${args.dokaCost} Doka (1:3)`;
  return {
    label,
    title: `Heal ${args.healHp} HP for ${args.dokaCost} Doka (3 HP per Doka)`,
  };
}
