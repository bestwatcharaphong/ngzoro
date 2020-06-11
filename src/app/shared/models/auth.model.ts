export interface Ticket {
  expires_at: string;
  ticket: string;
}

export interface AuthorizedResult {
  token: string;
  type: string;
}
