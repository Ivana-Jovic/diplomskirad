import dynamic from "next/dynamic";
const Kk = dynamic(() => import("../components/kk"), {
  ssr: false,
});
export default function Bljuc() {
  return <Kk />;
}
