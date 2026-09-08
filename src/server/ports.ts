import type {
  Answers,
  Project,
  Session,
  Document,
  Score,
  Receipt,
  Contact,
} from "@/domain/model";
export interface LocationSearchProvider {
  search(
    query: string,
  ): Promise<{ address: string; source: string; coordinates: null }[]>;
}
export interface SiteEvidenceProvider {
  get(
    project: Project,
  ): Promise<{ available: boolean; source: string | null; coordinates: null }>;
}
export interface DraftRepository {
  get(id: string, session: Session): Project;
  save(
    id: string,
    session: Session,
    revision: number,
    answers: Answers,
    step: number,
    completeStep?: boolean,
  ): Project;
}
export interface UploadProvider {
  upload(
    id: string,
    session: Session,
    file: File,
    category: Document["category"],
    revision: number,
  ): Promise<Project>;
}
export interface QualificationProvider {
  qualify(id: string, session: Session, revision: number): Promise<Project>;
}
export interface SubmissionProvider {
  submit(
    id: string,
    session: Session,
    input: {
      requestId: string;
      revision: number;
      contact: Contact;
      consent: true;
      comment: string;
      documentIds: string[];
    },
  ): Receipt;
}
export interface PartnerProjectRepository {
  list(session: Session): Project[];
  get(id: string, session: Session): Project;
}
export interface PartnerActionProvider {
  execute(id: string, session: Session, input: unknown): Project;
}
export interface AuthProvider {
  create(role: Session["role"]): { token: string; session: Session };
  resolve(token: string | undefined): Session | null;
}
export interface NotificationProvider {
  send(
    requestId: string,
    recipient: string,
    message: string,
  ): Promise<{
    delivery: "CONFIRMED" | "FAILED" | "UNKNOWN" | "SIMULATED_CONFIRMED";
  }>;
}
export type QualificationResult = Score;
