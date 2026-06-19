export type PortalStage = {
  id: string;
  name: string;
  shortName: string;
  order: number;
};

export const PORTAL_STAGES: PortalStage[] = [
  {
    id: "6850e4483f056b0c4fa4e0b7",
    name: "Start Production",
    shortName: "Production",
    order: 1,
  },
  {
    id: "6850e44dc70d6182848ed1d0",
    name: "Copy Printing Checking",
    shortName: "Proof Check",
    order: 2,
  },
  {
    id: "6850e4545a1acd78b7bcf782",
    name: "Copy Printing Approved",
    shortName: "Proof OK",
    order: 3,
  },
  {
    id: "6850e458ab79fbd30aa878a6",
    name: "Paper Printing & Heat Transfer",
    shortName: "Printing",
    order: 4,
  },
  {
    id: "6850e45d792b0bab7748d793",
    name: "QC & Sewing",
    shortName: "QC / Sew",
    order: 5,
  },
  {
    id: "6850e46643756b2f3c787801",
    name: "Order Shipment",
    shortName: "Shipped",
    order: 6,
  },
  {
    id: "6850e47575554a04460f3e93",
    name: "Received",
    shortName: "Received",
    order: 7,
  },
  {
    id: "6850e47e2749ecdbd264303a",
    name: "Order Feedback",
    shortName: "Feedback",
    order: 8,
  },
];

export const FINALIZED_LIST_IDS = new Set([
  "697dbf9d053293bee3275489",
  "6866458c0b5aa383121cee38",
]);

export const READY_FOR_SHIPPING_ID = "687d97ba7a1dd13cfe1fba10";

export function getStageIndex(listId: string): number {
  const idx = PORTAL_STAGES.findIndex((s) => s.id === listId);
  if (idx >= 0) return idx;
  if (listId === READY_FOR_SHIPPING_ID) return 5;
  if (FINALIZED_LIST_IDS.has(listId)) return PORTAL_STAGES.length;
  return -1;
}

export function getStageForList(listId: string): PortalStage | null {
  return PORTAL_STAGES.find((s) => s.id === listId) ?? null;
}

export function getProgressPercent(listId: string): number {
  const idx = getStageIndex(listId);
  if (idx < 0) return 5;
  if (idx >= PORTAL_STAGES.length) return 100;
  return Math.round(((idx + 0.5) / PORTAL_STAGES.length) * 100);
}
