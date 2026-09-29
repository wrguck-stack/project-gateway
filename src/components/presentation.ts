// Presentation labels for historical system records. Stored identifiers and
// audit events remain unchanged; arbitrary user-authored text is not rewritten.
export function partnerLabel(name: string) {
  return name === "Gateway Demopartner" ? "Gateway Projektpartner" : name;
}

const activityLabels: Record<string, string> = {
  "Demo-Qualifizierung erstellt": "Projektqualifizierung erstellt",
  "Übermittlung simuliert": "Projektanfrage gespeichert",
  "Übernahme simuliert": "Übernahme dokumentiert",
  "Rückfrage simuliert": "Rückfrage gespeichert",
  "Ablehnung simuliert": "Ablehnung dokumentiert",
  "Demo-Meilenstein dokumentiert": "Meilenstein dokumentiert",
  "Synthetischen Bestandsstand geladen": "Projektbestand geladen",
};

export function activityLabel(action: string) {
  return Object.hasOwn(activityLabels, action)
    ? activityLabels[action]
    : action;
}

export function actorLabel(actor: string) {
  if (actor === "demo-reviewer") return "Projektteam";
  if (actor === "Demo-Datenimport") return "Datenübernahme";
  return actor;
}
