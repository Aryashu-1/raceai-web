export interface ProjectCollaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "online" | "offline" | "away";
}

export interface ProjectNode {
  id: string;
  name: string;
  type: "folder" | "file";
  description?: string;
  collaborators?: ProjectCollaborator[];
  fileUrl?: string | null;
  fileType?: string;
  size?: string | null;
  lastModified?: string;

  children?: ProjectNode[];
}
