"use client";
import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type InputHTMLAttributes,
} from "react";
import { ArrowRight, Close, WarningAlt } from "@carbon/icons-react";
export function Button({
  children,
  pending = false,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
  variant?: "primary" | "secondary" | "text" | "critical";
}) {
  return (
    <button
      {...props}
      disabled={props.disabled || pending}
      className={`button ${variant} ${props.className ?? ""}`}
      aria-busy={pending}
    >
      {children}
      {variant === "primary" && <ArrowRight size={20} aria-hidden />}
    </button>
  );
}
export function Notice({
  children,
  critical = false,
}: {
  children: ReactNode;
  critical?: boolean;
}) {
  return (
    <div className={`notice ${critical ? "critical-notice" : ""}`}>
      <WarningAlt size={20} aria-hidden />
      <div>{children}</div>
    </div>
  );
}
export function ErrorNotice({ message }: { message: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (message) ref.current?.focus();
  }, [message]);
  return message ? (
    <div
      ref={ref}
      className="notice critical-notice"
      role="alert"
      tabIndex={-1}
      id="form-error"
    >
      {message}
    </div>
  ) : null;
}
export function Field({
  label,
  help,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  help?: string;
  error?: boolean;
}) {
  const fallback = useId();
  const id = props.id ?? fallback;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        id={id}
        aria-invalid={error || props["aria-invalid"] || undefined}
        aria-describedby={
          [
            props["aria-describedby"],
            help ? `${id}-help` : null,
            error ? "form-error" : null,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {help && <small id={`${id}-help`}>{help}</small>}
    </div>
  );
}
export function SelectField({
  label,
  value,
  onChange,
  options,
  id,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  id?: string;
  disabled?: boolean;
}) {
  const fid = useId();
  return (
    <div className="field">
      <label htmlFor={id ?? fid}>{label}</label>
      <select
        id={id ?? fid}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "Bitte auswählen"}
          </option>
        ))}
      </select>
    </div>
  );
}
export function Options({
  label,
  value,
  onChange,
  options,
  name,
}: {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: readonly string[];
  name: string;
}) {
  return (
    <fieldset className="options">
      <legend>{label}</legend>
      {options.map((o) => (
        <label className={`option ${value === o ? "selected" : ""}`} key={o}>
          <input
            type="radio"
            name={name}
            value={o}
            checked={value === o}
            onChange={() => onChange(o)}
          />
          <span>{o}</span>
        </label>
      ))}
    </fieldset>
  );
}
export function Checks({
  label,
  values,
  onChange,
  options,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: readonly string[];
}) {
  return (
    <fieldset className="options">
      <legend>{label}</legend>
      {options.map((o) => (
        <label
          className={`option ${values.includes(o) ? "selected" : ""}`}
          key={o}
        >
          <input
            type="checkbox"
            checked={values.includes(o)}
            onChange={(e) =>
              onChange(
                e.target.checked
                  ? [...values, o]
                  : values.filter((v) => v !== o),
              )
            }
          />
          <span>{o}</span>
        </label>
      ))}
    </fieldset>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const id = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    titleRef.current?.focus();
    return () => {
      dialog?.close();
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-head">
        <h2 ref={titleRef} id={id} tabIndex={-1}>
          {title}
        </h2>
        <button
          className="icon-button"
          aria-label="Schließen"
          onClick={onClose}
        >
          <Close size={24} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function ResponsiveDisclosure({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (ref.current) ref.current.open = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return (
    <details ref={ref} className="factors-disclosure" open>
      {children}
    </details>
  );
}
