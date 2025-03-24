import { Suspense, lazy, useEffect, useState } from "react";
import { useHeaderContext } from "../../layout/Contexts/HeaderContext";

const dicebox = lazy(() => import("./dicebox"));

const DiceThrowing: React.FC = () => {
  const [Dicebox, setDicebox] = useState<React.ComponentType | null>(null);
  const { setTitle } = useHeaderContext();
  useEffect(() => {
    setTitle(<h1 className="text-3xl font-bold">Dice Throwing</h1>);
    setDicebox(dicebox);
  }, [setTitle]);

  if (!Dicebox) {
    return <div>Loading Dice Box...</div>;
  }
  console.log("DiceThrowing");
  return (
    <Suspense fallback={<div>Loading Dice Box...</div>}>
      <Dicebox />
    </Suspense>
  );
};

export default DiceThrowing;
