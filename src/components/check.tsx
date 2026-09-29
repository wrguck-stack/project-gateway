"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type Answers,
  type Project,
  buildingTypes,
  categories,
  goals,
} from "@/domain/model";
import { numberDE, parseGermanNumber, readableError } from "@/domain/rules";
import { api, ApiError } from "./client-api";
import {
  Button,
  Checks,
  ErrorNotice,
  Field,
  Notice,
  Options,
  SelectField,
} from "./ui";
import { SiteContext } from "./site-context";
import { UploadList } from "./uploads";
export const questions = [
  "Ist das Ihr Standort?",
  "Was befindet sich am Standort?",
  "Welche Fläche steht zur Verfügung?",
  "In welcher Rolle planen Sie das Projekt?",
  "Wie viel Strom nutzt Ihr Standort?",
  "Gibt es bereits eine PV-Anlage?",
  "Ist ein Speicher vorhanden?",
  "Was soll das Projekt erreichen?",
  "Welche Unterlagen liegen vor?",
  "Machen Sie das Projekt greifbar.",
];
export function NumericField({
  label,
  value,
  onChange,
  unit,
  id,
  required = false,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  unit: string;
  id: string;
  required?: boolean;
}) {
  const [raw, setRaw] = useState(
    numberDE(value) === "Noch unbekannt" ? "" : numberDE(value, 3),
  );
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setRaw(value === null ? "" : numberDE(value, 3));
  }, [value]);
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} <span className="muted">{unit}</span>
      </label>
      <input
        ref={ref}
        id={id}
        value={raw}
        inputMode="decimal"
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => {
          setRaw(e.target.value);
          ref.current?.setCustomValidity("");
          setError("");
        }}
        onBlur={() => {
          try {
            const n = parseGermanNumber(raw);
            onChange(n);
            setRaw(n === null ? "" : numberDE(n, 3));
            setError("");
            ref.current?.setCustomValidity("");
          } catch (e) {
            const message = readableError(e);
            setError(message);
            ref.current?.setCustomValidity(message);
          }
        }}
      />
      {error && (
        <small id={`${id}-error`} className="critical-text">
          {error}
        </small>
      )}
    </div>
  );
}
export function Check({ initial, step }: { initial: Project; step: number }) {
  const [project, setProject] = useState(initial);
  const [a, setA] = useState(initial.answers);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [uploadsBlockNavigation, setUploadsBlockNavigation] = useState(false);
  const uploadsBlockNavigationRef = useRef(false);
  const onUploadNavigationChange = useCallback((blocked: boolean) => {
    uploadsBlockNavigationRef.current = blocked;
    setUploadsBlockNavigation(blocked);
  }, []);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const review = params.get("return") === "review";
  useEffect(() => {
    setProject(initial);
    setA(initial.answers);
    setError("");
    setPending(false);
    pendingRef.current = false;
    onUploadNavigationChange(false);
  }, [initial, step, onUploadNavigationChange]);
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setA((old) => ({ ...old, [key]: value }));
  const opts = (
    label: string,
    key: keyof Answers,
    options: readonly string[],
  ) => (
    <Options
      label={label}
      name={key}
      value={typeof a[key] === "string" ? (a[key] as string) : null}
      options={options}
      onChange={(v) => {
        set(key, v as never);
        if (key === "buildingType" && v === "Freifläche")
          set("areaKind", "Freifläche");
      }}
    />
  );
  const num = (
    label: string,
    key: keyof Answers,
    unit: string,
    required = false,
  ) => (
    <NumericField
      id={key}
      label={label}
      value={a[key] as number | null}
      onChange={(v) => set(key, v as never)}
      unit={unit}
      required={required}
    />
  );
  async function save(target?: string) {
    if (pendingRef.current || uploadsBlockNavigationRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setError("");
    try {
      const updated = await api<Project>(`/api/drafts/${project.id}`, "PATCH", {
        revision: project.revision,
        answers: a,
        step,
        completeStep: !target,
      });
      setProject(updated);
      try {
        sessionStorage.setItem(
          "gateway-draft",
          JSON.stringify({ id: updated.id, address: updated.answers.address }),
        );
      } catch {
        // The server has saved the draft; unavailable browser storage must
        // not prevent continuing through its authenticated URL.
      }
      router.push(
        target ??
          `/standortcheck/${project.id}/${review || step === 10 ? "zusammenfassung" : step + 1}`,
      );
    } catch (e) {
      setError(readableError(e));
      setPending(false);
      pendingRef.current = false;
    }
  }
  const chapter = step === 1 ? 0 : step <= 4 ? 1 : step <= 8 ? 2 : 3;
  return (
    <main className="wrap check-shell" id="main">
      <div className="check-progress">
        <ol className="chapters">
          {["Standort", "Objekt", "Energie", "Unterlagen"].map((label, i) => (
            <li
              key={label}
              className={i === chapter ? "active" : i < chapter ? "done" : ""}
            >
              <span aria-hidden />
              {label}
            </li>
          ))}
        </ol>
        <p className="mono">Schritt {step} von 10</p>
        <details className="step-index">
          <summary>Schritteübersicht</summary>
          <nav aria-label="Besuchte Schritte">
            {questions.map((q, i) => (
              <button
                disabled={
                  i + 1 > project.maxVisited ||
                  pending ||
                  uploadsBlockNavigation
                }
                key={q}
                onClick={() => save(`/standortcheck/${project.id}/${i + 1}`)}
                aria-current={i + 1 === step ? "step" : undefined}
              >
                {i + 1}. {q}
              </button>
            ))}
          </nav>
        </details>
      </div>
      <div className="check-grid">
        <section className="check-form">
          <p className="overline">
            Q{String(step).padStart(2, "0")} /{" "}
            {["STANDORT", "OBJEKT", "ENERGIE", "UNTERLAGEN"][chapter]}
          </p>
          <h1>{questions[step - 1]}</h1>
          <p className="check-help">
            {
              [
                "Prüfen Sie die Adresse oder beschreiben Sie Ihre Fläche. Fehlende Geodaten blockieren den Check nicht.",
                "Die Auswahl bestimmt die nächsten Fragen.",
                "Geben Sie die verfügbare Dachfläche oder unbebaute Fläche an. Unbekannte Werte dürfen offenbleiben.",
                "Ihre Rolle hilft, die nächsten Abstimmungen einzuordnen.",
                "Ein Jahreswert liefert eine erste Größenordnung. Die zeitliche Verbrauchspassung bleibt separat zu prüfen.",
                "Vorhandene PV-Angaben ergänzen die Projektakte.",
                "Auch ohne Speicher können Sie ein Speicherprojekt erfassen.",
                "Wählen Sie ein Hauptziel. Weitere Ziele sind optional.",
                "Sie können auch mit fehlenden Unterlagen fortfahren.",
                "Laden Sie verfügbare Unterlagen hoch. Technisch verfügbar bedeutet noch nicht fachlich geprüft.",
              ][step - 1]
            }
          </p>
          <ErrorNotice message={error} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            {step === 1 && (
              <>
                <Field
                  label="Adresse oder Standortbeschreibung"
                  id="address"
                  value={a.address}
                  onChange={(e) => set("address", e.target.value)}
                  required
                  minLength={3}
                  maxLength={240}
                />
                <Field
                  label="PLZ / Ort (optional)"
                  value={a.postalCity}
                  onChange={(e) => set("postalCity", e.target.value)}
                />
                <Field
                  label="Flurstück (optional)"
                  value={a.parcel}
                  onChange={(e) => set("parcel", e.target.value)}
                />
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={a.locationConfirmed}
                    onChange={(e) => set("locationConfirmed", e.target.checked)}
                  />
                  Ich bestätige die Standortangabe.
                </label>
                <small>Vom Nutzer angegeben · geografisch ungeprüft</small>
              </>
            )}
            {step === 2 && (
              <>
                {opts(
                  "Gebäude- oder Flächentyp",
                  "buildingType",
                  buildingTypes,
                )}
                {a.buildingType === "Sonstiges" && (
                  <Field
                    label="Gebäude beschreiben"
                    value={a.otherBuilding}
                    onChange={(e) => set("otherBuilding", e.target.value)}
                    required
                    minLength={3}
                    maxLength={160}
                  />
                )}
              </>
            )}
            {step === 3 && (
              <>
                {opts("Art der verfügbaren Fläche", "areaKind", [
                  "Dach",
                  "Freifläche",
                ])}
                <SelectField
                  label="Genauigkeit der Fläche"
                  value={
                    {
                      OBSERVED: "Genau bekannt",
                      ESTIMATED: "Geschätzt",
                      UNKNOWN: "Noch unbekannt",
                    }[a.areaNature]
                  }
                  options={["Genau bekannt", "Geschätzt", "Noch unbekannt"]}
                  onChange={(v) => {
                    set(
                      "areaNature",
                      v === "Genau bekannt"
                        ? "OBSERVED"
                        : v === "Geschätzt"
                          ? "ESTIMATED"
                          : "UNKNOWN",
                    );
                    if (v === "Noch unbekannt") set("area", null);
                  }}
                />
                {a.areaNature !== "UNKNOWN" &&
                  num("Verfügbare Fläche", "area", "m²", true)}
                {a.areaKind === "Dach" ? (
                  <>
                    <SelectField
                      label="Dachform"
                      value={a.roofForm}
                      options={[
                        "Flachdach",
                        "Satteldach",
                        "Sonstige",
                        "Unbekannt",
                      ]}
                      onChange={(v) =>
                        set("roofForm", v as Answers["roofForm"])
                      }
                    />
                    <SelectField
                      label="Dachzustand (Nutzerauskunft)"
                      value={a.roofCondition}
                      options={[
                        "Keine Sanierung bekannt",
                        "Sanierung geplant",
                        "Unbekannt",
                      ]}
                      onChange={(v) =>
                        set("roofCondition", v as Answers["roofCondition"])
                      }
                    />
                    <details className="inline-details">
                      <summary>Weitere Dachangaben (optional)</summary>
                      {num("Bereits belegte Teilfläche", "occupiedArea", "m²")}
                      {num("Bekannte nutzbare Fläche", "usableArea", "m²")}
                      <Field
                        label="Dachmaterial"
                        value={a.roofMaterial}
                        onChange={(e) => set("roofMaterial", e.target.value)}
                      />
                    </details>
                  </>
                ) : (
                  <>
                    <Field
                      label="Aktuelle Flächennutzung"
                      value={a.currentUse}
                      onChange={(e) => set("currentUse", e.target.value)}
                    />
                    <Field
                      label="Flurstück (optional)"
                      value={a.parcel}
                      onChange={(e) => set("parcel", e.target.value)}
                    />
                    <Notice>
                      Dachangaben sind für die Freifläche nicht relevant und
                      fließen nicht in das aktive Modell ein.
                    </Notice>
                  </>
                )}
              </>
            )}
            {step === 4 && (
              <>
                {opts("Ihre Rolle", "role", [
                  "Eigentümer",
                  "Mieter / Pächter",
                  "Verwaltung / Bevollmächtigt",
                  "Andere Rolle",
                ])}
                {opts("Status der Berechtigung", "authority", [
                  "Liegt vor",
                  "In Klärung",
                  "Unbekannt",
                ])}
                {a.role === "Mieter / Pächter" &&
                  opts("Kontakt zum Eigentümer", "ownerContact", [
                    "Besteht",
                    "Wird geklärt",
                    "Unbekannt",
                  ])}
                <small>
                  Ihre Angabe ist kein geprüfter Eigentums- oder
                  Vollmachtsnachweis.
                </small>
              </>
            )}
            {step === 5 && (
              <>
                <SelectField
                  label="Herkunft des Verbrauchswerts"
                  value={
                    {
                      OBSERVED: "Wert aus Abrechnung",
                      ESTIMATED: "Geschätzt",
                      UNKNOWN: "Noch unbekannt",
                    }[a.consumptionNature]
                  }
                  options={[
                    "Wert aus Abrechnung",
                    "Geschätzt",
                    "Noch unbekannt",
                  ]}
                  onChange={(v) => {
                    set(
                      "consumptionNature",
                      v === "Wert aus Abrechnung"
                        ? "OBSERVED"
                        : v === "Geschätzt"
                          ? "ESTIMATED"
                          : "UNKNOWN",
                    );
                    if (v === "Noch unbekannt") set("consumption", null);
                  }}
                />
                {a.consumptionNature !== "UNKNOWN" && (
                  <>
                    {num("Jahresverbrauch", "consumption", "kWh/Jahr", true)}
                    <Field
                      label="Bezugsjahr"
                      type="number"
                      min={1900}
                      max={2100}
                      value={a.consumptionYear}
                      onChange={(e) =>
                        set("consumptionYear", Number(e.target.value))
                      }
                    />
                    {a.consumption === 0 && (
                      <label className="check-label">
                        <input
                          id="zeroConfirmed"
                          type="checkbox"
                          checked={a.zeroConfirmed}
                          onChange={(e) =>
                            set("zeroConfirmed", e.target.checked)
                          }
                        />
                        Der Standort hat derzeit keinen Verbrauch.
                      </label>
                    )}
                  </>
                )}
                {opts("Typisches Verbrauchsprofil", "usageProfile", [
                  "Tagsüber",
                  "Rund um die Uhr",
                  "Saisonal",
                  "Unbekannt",
                ])}
              </>
            )}
            {step === 6 && (
              <>
                {opts("Bestehende PV-Anlage", "pv", [
                  "Ja",
                  "Nein",
                  "Unbekannt",
                ])}
                {a.pv === "Ja" && (
                  <>
                    {num("Installierte Leistung (optional)", "pvPower", "kWp")}
                    <Field
                      label="Inbetriebnahmejahr (optional)"
                      type="number"
                      min={1900}
                      max={2100}
                      value={a.pvYear ?? ""}
                      onChange={(e) =>
                        set(
                          "pvYear",
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    />
                    {opts("Nutzung der PV-Anlage", "pvUsage", [
                      "Eigenverbrauch",
                      "Einspeisung",
                      "Unbekannt",
                    ])}
                  </>
                )}
              </>
            )}
            {step === 7 && (
              <>
                {opts("Bestehender Speicher", "battery", [
                  "Ja",
                  "Nein",
                  "Unbekannt",
                ])}
                {a.battery === "Ja" && (
                  <>
                    {num(
                      "Nutzbare Kapazität (optional)",
                      "batteryCapacity",
                      "kWh",
                    )}
                    {num("Leistung (optional)", "batteryPower", "kW")}
                    <Field
                      label="Inbetriebnahmejahr (optional)"
                      type="number"
                      min={1900}
                      max={2100}
                      value={a.batteryYear ?? ""}
                      onChange={(e) =>
                        set(
                          "batteryYear",
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    />
                  </>
                )}
              </>
            )}
            {step === 8 && (
              <>
                {opts("Hauptziel", "goal", goals)}
                <details className="inline-details">
                  <summary>Weitere Ziele und Beschreibung</summary>
                  <Checks
                    label="Optionale weitere Ziele"
                    values={a.additionalGoals}
                    options={goals.filter((g) => g !== a.goal)}
                    onChange={(v) =>
                      set("additionalGoals", v as Answers["additionalGoals"])
                    }
                  />
                  <label className="field">
                    Projektbeschreibung
                    <textarea
                      value={a.description}
                      onChange={(e) => set("description", e.target.value)}
                      maxLength={2000}
                    />
                  </label>
                </details>
              </>
            )}
            {step === 9 && (
              <>
                <Checks
                  label="Vorhandene Unterlagen"
                  values={a.availableDocuments}
                  options={categories}
                  onChange={(v) => {
                    set(
                      "availableDocuments",
                      v as Answers["availableDocuments"],
                    );
                    set("noDocuments", false);
                  }}
                />
                <label className="option">
                  <input
                    type="checkbox"
                    checked={a.noDocuments}
                    onChange={(e) => {
                      set("noDocuments", e.target.checked);
                      if (e.target.checked) set("availableDocuments", []);
                    }}
                  />
                  Noch keine Unterlagen verfügbar
                </label>
                <small>Verfügbar bedeutet noch nicht hochgeladen.</small>
              </>
            )}
            {step === 10 && (
              <UploadList
                project={project}
                disabled={pending}
                onNavigationBlockedChange={onUploadNavigationChange}
                onChange={(p) => {
                  setProject(p);
                  setA(p.answers);
                }}
              />
            )}
            <div className="step-actions">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  pending={pending}
                  disabled={uploadsBlockNavigation}
                  onClick={() =>
                    save(`/standortcheck/${project.id}/${step - 1}`)
                  }
                >
                  Zurück
                </Button>
              ) : (
                <Link href="/" className="button secondary">
                  Zur Startseite
                </Link>
              )}
              <Button
                type="submit"
                pending={pending}
                disabled={uploadsBlockNavigation}
              >
                {review
                  ? "Zur Zusammenfassung"
                  : step === 1
                    ? "Standort bestätigen"
                    : step === 8
                      ? "Zu den Unterlagen"
                      : step === 9
                        ? "Dateien hinzufügen"
                        : step === 10
                          ? "Angaben prüfen"
                          : "Weiter"}
              </Button>
            </div>
            <p className="save-state">
              {pending
                ? "Wird gespeichert …"
                : uploadsBlockNavigation
                  ? "Bitte Dateien abschließen, entfernen oder ausdrücklich auslassen."
                  : JSON.stringify(a) === JSON.stringify(project.answers)
                    ? "Gespeichert"
                    : "Änderungen vorhanden · beim Weitergehen speichern"}
            </p>
            {error && (
              <Button
                type="button"
                variant="text"
                onClick={async () => {
                  try {
                    const p = await api<Project>(`/api/projects/${project.id}`);
                    setProject(p);
                    setError(
                      "Aktueller Stand geladen. Ihre Eingaben wurden erhalten; bitte erneut prüfen und speichern.",
                    );
                  } catch (e) {
                    setError(readableError(e));
                  }
                }}
              >
                Aktuellen Stand laden
              </Button>
            )}
          </form>
        </section>
        <aside className="check-context">
          <SiteContext address={a.address} synthetic={project.synthetic} />
          <div className="context-facts">
            <h2 className="context-title">
              {a.buildingType ?? "Ihr Projektstandort"}
            </h2>
            <p>
              {numberDE(a.area)}{" "}
              {a.area === null
                ? ""
                : "m² · " +
                  (a.areaNature === "ESTIMATED" ? "geschätzt" : "angegeben")}
            </p>
            <p>
              {a.consumption === null
                ? "Verbrauch noch unbekannt"
                : `${numberDE(a.consumption)} kWh/Jahr · Nutzerangabe`}
            </p>
            <p>Eigentum und technische Eignung bleiben fachlich zu prüfen.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
