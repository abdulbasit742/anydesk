export interface SeatAllocationInput {
  purchasedSeats: number;
  activeMembers: number;
  pendingInvites: number;
}

export function remainingSeats(input: SeatAllocationInput): number {
  return Math.max(0, input.purchasedSeats - input.activeMembers - input.pendingInvites);
}

export function canInviteSeat(input: SeatAllocationInput): boolean {
  return remainingSeats(input) > 0;
}
