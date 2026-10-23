import { LegalPage, legalMetadata } from "@/components/site/LegalPage";

export const generateMetadata = () => legalMetadata("privacy");

export default function Page() {
  return <LegalPage page="privacy" />;
}
