export interface OAuth2 {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: "read write";
  token_type: "Bearer";
}
