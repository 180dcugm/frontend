import LookForward from "@/components/layout/LookForward";
import { Telescopes } from "@/components/modules/telescope";
import { getPayload } from "payload";
import config from "@payload-config";


export default async function TelescopePage() {
  const payload = await getPayload({ config });

  const telescope = await payload.find({
    collection: "telescope",
  });

  return (
    <main>
      <Telescopes articles={telescope.docs} />
      <LookForward theme={"dark"} />
    </main>
  );
}
