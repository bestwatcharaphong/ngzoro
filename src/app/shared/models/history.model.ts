export interface History {
  id: string;
  date: Date;
  file_name: string;
  importer: string;
  record: number;
  user: User;
}

// user
export interface User {
  account_id: string;
  activated: boolean;
  created_at: Date;
  deleted_at?: Date;
  first_name: string;
  last_name: string;
  role: string;
  seq: number;
  title: string;
  uid: string;
  updated_at: Date;
  username: string;
}

export interface UploadInfo {
  importDate: Date;
  importer: string;
  record: number;
  successList: string[];
  failList: string[];
}
