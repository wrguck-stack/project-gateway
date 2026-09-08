import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="wrap page">
      <h1>Seite nicht gefunden.</h1>
      <Link href="/" className="button primary">
        Zur Startseite →
      </Link>
    </main>
  );
}
