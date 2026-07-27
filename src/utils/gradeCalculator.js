// Converts a numerical score (0-100) into a letter grade.
export function scoreToGrade(score) {
  const n = Number(score);
  if (Number.isNaN(n)) return '-';
  if (n >= 90) return 'A';
  if (n >= 75) return 'B';
  if (n >= 60) return 'C';
  if (n >= 40) return 'D';
  return 'F';
}

// Computes attendance percentage from an array of records,
// counting 'late' as half presence, per the handbook's AI prompt guide (Sec 14.1).
export function computeAttendancePercentage(records) {
  if (!records || records.length === 0) return 0;
  const total = records.length;
  const weighted = records.reduce((sum, r) => {
    if (r.status === 'present') return sum + 1;
    if (r.status === 'late') return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((weighted / total) * 100);
}
