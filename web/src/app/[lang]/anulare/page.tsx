import { LegalPage, legalMetadata } from "@/components/site/LegalPage";

export const generateMetadata = () => legalMetadata("cancellation");

export default function Page() {
  return <LegalPage page="cancellation" />;
}
