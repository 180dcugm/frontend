import BuyForm from "@/components/modules/store/buy/BuyForm";

export const metadata = {
  title: "Merch Store | 180 Degrees Consulting UGM",
};

const isMerchOpen = true;

export default function StoreFormPage() {
  return (
    <BuyForm isMerchOpen={isMerchOpen}/>
  );
}
