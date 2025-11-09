import ReportInfoPage from "@/components/ReportInfo";
import { useLocalSearchParams } from "expo-router";

export default function ReportInfoScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ReportInfoPage id={id as string} />
  );
}
