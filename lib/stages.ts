import { fetchBoardLists } from "./trello";

export type PortalStage = {
  id: string;
  name: string;
  shortName: string;
  order: number;
};

export type BoardStageConfig = {
  stages: PortalStage[];
  readyForShippingId: string | null;
  finalizedListIds: Set<string>;
};

export type StageProgressConfig = {
  stages: PortalStage[];
  readyForShippingId: string | null;
  finalizedListIds: string[];
};

const STAGE_RULES = [
  {
    name: "Order Ready",
    shortName: "Ready",
    order: 1,
    match: (n: string) => n.includes("order ready"),
  },
  {
    name: "PI Approved",
    shortName: "PI OK",
    order: 2,
    match: (n: string) => n.includes("pi approved"),
  },
  {
    name: "Start Production",
    shortName: "Production",
    order: 3,
    match: (n: string) => n.includes("start production"),
  },
  {
    name: "Copy Printing Checking",
    shortName: "Proof Check",
    order: 4,
    match: (n: string) => n.includes("copy printing checking"),
  },
  {
    name: "Copy Printing Approved",
    shortName: "Proof OK",
    order: 5,
    match: (n: string) => n.includes("copy printing approved"),
  },
  {
    name: "Paper Printing & Heat Transfer",
    shortName: "Printing",
    order: 6,
    match: (n: string) =>
      n.includes("paper printing") && n.includes("heat transfer"),
  },
  {
    name: "QC & Sewing",
    shortName: "QC / Sew",
    order: 7,
    match: (n: string) =>
      (n.includes("qc") && n.includes("sewing")) || n.includes("qc pieces"),
  },
  {
    name: "Order Shipment",
    shortName: "Shipped",
    order: 8,
    match: (n: string) => n.includes("order ship"),
  },
  {
    name: "Received",
    shortName: "Received",
    order: 9,
    match: (n: string) =>
      /\breceived\b/.test(n) && !n.includes("order ready"),
  },
  {
    name: "Order Feedback",
    shortName: "Feedback",
    order: 10,
    match: (n: string) => n.includes("order feedback"),
  },
] as const;

function normalizeListName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

const configCache = new Map<string, { config: BoardStageConfig; expires: number }>();
const CACHE_TTL_MS = 60_000;

export function buildStageConfigFromLists(
  lists: { id: string; name: string }[]
): BoardStageConfig {
  const normalized = lists.map((list) => ({
    ...list,
    normalized: normalizeListName(list.name),
  }));

  let readyForShippingId: string | null = null;
  const finalizedListIds = new Set<string>();

  for (const list of normalized) {
    if (list.normalized.includes("ready for shipping")) {
      readyForShippingId = list.id;
    }
    if (list.normalized.includes("finalized")) {
      finalizedListIds.add(list.id);
    }
  }

  const stages: PortalStage[] = STAGE_RULES.map((rule) => {
    const list = normalized.find((item) => rule.match(item.normalized));
    return {
      id: list?.id ?? `unmapped-${rule.order}`,
      name: rule.name,
      shortName: rule.shortName,
      order: rule.order,
    };
  });

  return { stages, readyForShippingId, finalizedListIds };
}

export async function resolveBoardStageConfig(
  boardId: string
): Promise<BoardStageConfig> {
  const key = boardId.trim();
  const cached = configCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.config;
  }

  const lists = await fetchBoardLists(key);
  const config = buildStageConfigFromLists(lists);
  configCache.set(key, { config, expires: Date.now() + CACHE_TTL_MS });
  return config;
}

export function toStageProgressConfig(
  config: BoardStageConfig
): StageProgressConfig {
  return {
    stages: config.stages,
    readyForShippingId: config.readyForShippingId,
    finalizedListIds: [...config.finalizedListIds],
  };
}

export function getStageIndex(listId: string, config: BoardStageConfig): number {
  const idx = config.stages.findIndex((s) => s.id === listId);
  if (idx >= 0) return idx;
  if (config.readyForShippingId && listId === config.readyForShippingId) return 6;
  if (config.finalizedListIds.has(listId)) return config.stages.length;
  return -1;
}

export function getStageForList(
  listId: string,
  config: BoardStageConfig
): PortalStage | null {
  return config.stages.find((s) => s.id === listId) ?? null;
}

export function getProgressPercent(listId: string, config: BoardStageConfig): number {
  const idx = getStageIndex(listId, config);
  if (idx < 0) return 5;
  if (idx >= config.stages.length) return 100;
  return Math.round(((idx + 0.5) / config.stages.length) * 100);
}

export function stageDisplayName(listId: string, config: BoardStageConfig): string {
  if (config.readyForShippingId && listId === config.readyForShippingId) {
    return "Ready for Shipping";
  }
  return getStageForList(listId, config)?.name ?? "In Progress";
}
