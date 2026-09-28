"use client";
import { useRef, useState } from "react";
import {
  Upload,
  Document as DocumentIcon,
  TrashCan,
} from "@carbon/icons-react";
import { categories, type Project, type Document } from "@/domain/model";
import { uploadLimits, numberDE, readableError } from "@/domain/rules";
import { api, ApiError } from "./client-api";
import { Button, ErrorNotice } from "./ui";
type Transfer = {
  id: string;
  chunkSize: number;
  chunkCount: number;
  expiresAt: number;
  nextIndex: number;
  finalizing: boolean;
};

async function sendChunk(url: string, bytes: Blob) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/octet-stream" },
      body: bytes,
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new ApiError(
        body?.error ??
          `Dateiabschnitt konnte nicht übertragen werden (HTTP ${response.status}). Bitte erneut versuchen.`,
        response.status,
      );
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Dateiübertragung unterbrochen. Bitte erneut versuchen; bestätigte Abschnitte bleiben erhalten.",
      0,
    );
  } finally {
    clearTimeout(timeout);
  }
}

type LocalFile = {
  file: File;
  state:
    | "selected"
    | "uploading"
    | "processing"
    | "failed"
    | "unsupported"
    | "too large";
  error?: string;
  transfer?: Transfer;
};
export function UploadList({
  project,
  onChange,
}: {
  project: Project;
  onChange: (p: Project) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [local, setLocal] = useState<LocalFile[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [omitted, setOmitted] = useState(false);
  async function upload(files: File[], retry?: LocalFile) {
    setError("");
    setOmitted(false);
    if (!retry) {
      try {
        uploadLimits([
          ...project.documents.filter((d) => d.state !== "removed"),
          ...local.map((item) => item.file),
          ...files,
        ]);
      } catch (error) {
        setError(readableError(error));
        setLocal((list) => [
          ...list,
          ...files.map((file): LocalFile => ({
            file,
            state: file.size > 20_000_000 ? "too large" : "unsupported",
            error: readableError(error),
          })),
        ]);
        return;
      }
      setLocal((list) => [
        ...list,
        ...files.map((file): LocalFile => ({ file, state: "selected" })),
      ]);
    }
    setBusy(true);
    let current = project;
    for (const file of files) {
      let transfer = retry?.transfer;
      const updateLocal = (changes: Partial<LocalFile>) =>
        setLocal((list) =>
          list.map((item) =>
            item.file === file ? { ...item, ...changes } : item,
          ),
        );
      updateLocal({
        state: transfer?.finalizing ? "processing" : "uploading",
        error: undefined,
      });
      try {
        const base = `/api/projects/${current.id}/transfers`;
        if (!transfer) {
          const created = await api<Omit<Transfer, "nextIndex" | "finalizing">>(
            base,
            "POST",
            {
              name: file.name,
              size: file.size,
              category: "Sonstiges",
              revision: current.revision,
            },
          );
          transfer = { ...created, nextIndex: 0, finalizing: false };
          updateLocal({ transfer });
        }
        if (!transfer.finalizing) {
          for (
            let index = transfer.nextIndex;
            index < transfer.chunkCount;
            index++
          ) {
            await sendChunk(
              `${base}/${transfer.id}/${index}`,
              file.slice(
                index * transfer.chunkSize,
                Math.min((index + 1) * transfer.chunkSize, file.size),
              ),
            );
            transfer = { ...transfer, nextIndex: index + 1 };
            updateLocal({ transfer });
          }
          transfer = { ...transfer, finalizing: true };
          updateLocal({ transfer, state: "processing" });
        }
        current = await api<Project>(
          `${base}/${transfer.id}/complete`,
          "POST",
          {},
        );
        onChange(current);
        setLocal((list) => list.filter((item) => item.file !== file));
      } catch (error) {
        // Retain the stable transfer ID after an uncertain response so retrying
        // reconciles the original finalization without creating a second file.
        updateLocal({
          state: "failed",
          error: readableError(error),
          transfer:
            error instanceof ApiError && error.status === 410
              ? undefined
              : transfer,
        });
      }
    }
    setBusy(false);
    if (input.current) input.current.value = "";
  }
  async function removeLocal(item: LocalFile) {
    setBusy(true);
    try {
      if (item.transfer)
        await api(
          `/api/projects/${project.id}/transfers/${item.transfer.id}`,
          "DELETE",
        );
      setLocal((list) => list.filter((entry) => entry !== item));
    } catch (error) {
      if (error instanceof ApiError && [404, 410].includes(error.status))
        setLocal((list) => list.filter((entry) => entry !== item));
      else setError(readableError(error));
    } finally {
      setBusy(false);
    }
  }
  async function update(
    documentId: string,
    category: Document["category"] | null,
  ) {
    setBusy(true);
    setError("");
    try {
      onChange(
        await api<Project>(`/api/projects/${project.id}/documents`, "PATCH", {
          revision: project.revision,
          documentId,
          category,
        }),
      );
    } catch (e) {
      setError(readableError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="uploads">
      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!busy) upload(Array.from(e.dataTransfer.files));
        }}
      >
        <Upload size={32} />
        <p>Dateien auswählen oder hier ablegen</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => input.current?.click()}
          disabled={busy}
        >
          Datei auswählen
        </Button>
        <input
          ref={input}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => upload(Array.from(e.target.files ?? []))}
          aria-label="Unterlagen hochladen"
        />
        <small>
          PDF, JPG, PNG, CSV, XLSX
          <br />
          20 MB je Datei · 15 Dateien · 100 MB gesamt
        </small>
      </div>
      <ErrorNotice message={error} />
      <ul className="document-list">
        {project.documents
          .filter((d) => d.state !== "removed")
          .map((d) => (
            <li key={d.id}>
              <DocumentIcon size={24} />
              <div>
                <a href={`/api/projects/${project.id}/documents/${d.id}`}>
                  {d.name}
                </a>
                <small>
                  {numberDE(d.size / 1_000_000, 2)} MB · Version {d.version} ·
                  Bereit
                </small>
                <small>Technisch verfügbar · nicht fachlich geprüft</small>
                <label>
                  Dokumentkategorie
                  <select
                    value={d.category}
                    onChange={(e) =>
                      update(d.id, e.target.value as Document["category"])
                    }
                    disabled={busy}
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="button"
                className="icon-button"
                disabled={busy}
                aria-label={`${d.name} entfernen`}
                onClick={() => update(d.id, null)}
              >
                <TrashCan size={20} />
              </button>
            </li>
          ))}
      </ul>
      <div aria-live="polite">
        {local.map((l, i) => (
          <div className="upload-local" key={i}>
            <strong>{l.file.name}</strong>
            <p>
              {
                {
                  selected: "Ausgewählt",
                  uploading: "Wird übertragen …",
                  processing: "Verarbeitung läuft …",
                  failed: "Fehlgeschlagen",
                  unsupported: "Nicht unterstützt",
                  "too large": "Zu groß",
                }[l.state]
              }
            </p>
            {l.error && <p className="critical-text">{l.error}</p>}
            {!busy && (
              <div className="actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => upload([l.file], l)}
                >
                  Erneut hochladen
                </Button>
                <Button
                  type="button"
                  variant="text"
                  onClick={() => removeLocal(l)}
                >
                  Entfernen
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {local.length > 0 && (
        <label className="check-label">
          <input
            type="checkbox"
            required
            checked={omitted && !busy}
            disabled={busy}
            onChange={(e) => setOmitted(e.target.checked)}
          />
          Ohne die nicht verfügbaren Dateien fortfahren.
        </label>
      )}
      {busy && (
        <p role="status">
          Übertragung läuft. Bitte vor der Zusammenfassung abschließen.
        </p>
      )}
      <p className="meta">
        {project.documents.filter((d) => d.state !== "removed").length} von 15
        Dateien · Originaldateien werden privat gespeichert.
      </p>
    </div>
  );
}
