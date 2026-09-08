import { Header } from "@/components/shell";
import { appMode } from "@/server/config";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header partner mode={appMode()} />
      {children}
    </>
  );
}
