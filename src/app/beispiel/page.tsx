import { Header, Footer } from "@/components/shell";
import { Result } from "@/components/public-flow";
import { seedProjects } from "@/server/seed";
export default function Page() {
  const p = seedProjects()[0];
  return (
    <>
      <Header />
      <Result project={p} canSubmit={false} example />
      <Footer />
    </>
  );
}
