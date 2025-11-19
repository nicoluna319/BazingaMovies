export interface User {
  id: string;              // id interno en tu BD
  email: string;
  name?: string | null;

  // para futuras features
  avatarUrl?: string | null;

  createdAt: Date;
  updatedAt: Date;
}
