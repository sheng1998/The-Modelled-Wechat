interface User {
  id: string;
  username: string;
  avatar: string;
  privileges: number;
}

type UserList = User[];

export type { User, UserList };
