import { Document } from "@react-pdf/renderer";
import Page1Cover from "./Page1Cover";
import Page2Introduction from "./Page2Introduction";
import Page3Summary from "./Page3Summary";
import Page4Benefits from "./Page4Benefits";
import Page5Team from "./Page5Team";
import Page6GettingStarted from "./Page6GettingStarted";
import Page7Vision from "./Page7Vision";
import type { OfferLetterData } from "@/lib/types";

export interface OfferLetterDocumentProps {
  data: OfferLetterData;
  baseUrl: string;
}

export default function OfferLetterDocument({
  data,
  baseUrl,
}: OfferLetterDocumentProps) {
  return (
    <Document
      title={`Offer Letter - ${data.firstName}`}
      author="Zingage"
      subject="Employment Offer Letter"
      creator="Zingage Offer Letter Generator"
    >
      <Page1Cover data={data} />
      <Page2Introduction data={data} baseUrl={baseUrl} />
      <Page3Summary data={data} />
      <Page4Benefits />
      <Page5Team baseUrl={baseUrl} />
      <Page6GettingStarted />
      <Page7Vision baseUrl={baseUrl} />
    </Document>
  );
}
