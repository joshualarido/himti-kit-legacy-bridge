export function formatCohortName(batch: number) {
  return `Binusian ${batch.toString().padStart(2, "0")}`;
}

export function parseCohortBatch(value: string) {
  return /^(0[1-9]|[1-9]\d)$/.test(value) ? Number(value) : null;
}
