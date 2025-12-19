/**
 * generateAccount: returns a unique account number string using regionCode and a 6-digit serial.
 * It does not create DB records — caller should create the account inside a transaction.
 */
export function generateAccount(regionCode: string, serialNumber?: number) {
  const seq = serialNumber ? serialNumber : Math.floor(100000 + Math.random() * 900000);
  const serial = String(seq).padStart(6, '0');
  return `${regionCode}-${serial}`;
}

export default generateAccount;
