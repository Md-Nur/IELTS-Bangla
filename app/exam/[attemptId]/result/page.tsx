import { Suspense, use } from "react";
import { ResultPageContent } from "@/components/results/ResultPageContent";
import { ResultLoadingState } from "@/components/results/ResultStates";

interface ResultPageProps {
  params: Promise<{ attemptId: string }>;
}

function ResultView({ params }: ResultPageProps) {
  const { attemptId } = use(params);
  return <ResultPageContent attemptId={attemptId} />;
}

export default function ExamResultAliasPage({ params }: ResultPageProps) {
  return (
    <Suspense fallback={<ResultLoadingState />}>
      <ResultView params={params} />
    </Suspense>
  );
}
