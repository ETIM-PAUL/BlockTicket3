import { Address } from "viem";

interface Referrals {
  id: number;
  code: number;
  event_id: number;
  owner: Address;
  count: number;
}

export const generate_code = (referrals: Array<Referrals>): number => {
  const existingCodes = referrals.map((referral) => referral.code);
  let code: number;
  do {
    // Generate a random 6-digit number
    code = Math.floor(100000 + Math.random() * 900000);
  } while (existingCodes.includes(code)); // Check if the code already exists
  return code;
};
