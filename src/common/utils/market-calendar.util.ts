export function getExecutionDate(): string {
  const today = new Date();
  const day = today.getDay();

  if (day === 6) {
    today.setDate(today.getDate() + 2);
  } else if (day === 0) {
    today.setDate(today.getDate() + 1);
  }

  return today.toISOString().split('T')[0];
}