import Link from "next/link";
import Layout from "../components/layout";

export default function RemovedByAdmin() {
  return (
    <Layout>
      <div className="h-screen bg-background flex items-center justify-center">
        ** You are removed by admin **
      </div>
    </Layout>
  );
}
