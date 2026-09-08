"use client";
import { useRef, useState } from "react";
import {
  Upload,
  Document as DocumentIcon,
  TrashCan,
} from "@carbon/icons-react";
import { categories, type Project, type Document } from "@/domain/model";
import { uploadLimits, numberDE, readableError } from "@/domain/rules";
import { api } from "./client-api";
import { Button, ErrorNotice } from "./ui";
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
  async function upload(files: File[]) {
    setError("");
    setOmitted(false);
    try {
      uploadLimits([
        ...project.documents.filter((d) => d.state !== "removed"),
        ...files,
      ]);
    } catch (e) {
      setError(readableError(e));
      setLocal(
        files.map((file) => ({
          file,
          state: file.size > 20_000_000 ? "too large" : "unsupported",
          error: readableError(e),
        })),
      );
      return;
    }
    setBusy(true);
    setLocal(files.map((file) => ({ file, state: "selected" })));
    let p = project;
    for (const file of files) {
      setLocal((list) =>
        list.map((l) => (l.file === file ? { ...l, state: "uploading" } : l)),
      );
      try {
        const data = new FormData();
        data.set("file", file);
        data.set("category", "Sonstiges");
        data.set("revision", String(p.revision));
        p = await api<Project>(`/api/projects/${p.id}/documents`, "POST", data);
        onChange(p);
        setLocal((list) => list.filter((l) => l.file !== file));
      } catch (e) {
        setLocal((list) =>
          list.map((l) =>
            l.file === file
              ? { ...l, state: "failed", error: readableError(e) }
              : l,
          ),
        );
      }
    }
    setBusy(false);
    if (input.current) input.current.value = "";
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
                  onClick={() => upload([l.file])}
                >
                  Erneut hochladen
                </Button>
                <Button
                  type="button"
                  variant="text"
                  onClick={() =>
                    setLocal((old) => old.filter((item) => item !== l))
                  }
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
        Dateien · Originaldateien liegen im privaten lokalen Demo-Speicher.
      </p>
    </div>
  );
}
