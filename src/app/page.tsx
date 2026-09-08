import { Landing } from "@/components/landing";
import { appMode } from "@/server/config";
export default function Page() {
  return <Landing mode={appMode()} />;
}
