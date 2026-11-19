import StoreLanding from "@/components/modules/store/store-landing/StoreLanding";
import { Suspense } from "react";

export const metadata = {
  title: "Store | 180 Degrees Consulting UGM",
};

export default async function Store() {
  return (
    <Suspense
      fallback={
        <div role="status" className="bg-black-300 min-h-screen px-6 pt-32 text-white">
          Loading products…
        </div>
      }
    >
      <StoreLanding />
    </Suspense>
  );
}
