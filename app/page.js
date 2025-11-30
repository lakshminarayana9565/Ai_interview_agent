import { Button } from "@/components/ui/button";
import Provider from "./provider";

export default function Home() {
  return (
    <Provider>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <Button variant="outline">Hello World</Button>
      </div>
    </Provider>
  );
}
