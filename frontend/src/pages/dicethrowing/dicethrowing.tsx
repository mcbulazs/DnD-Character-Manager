import { Suspense, lazy, useEffect, useState } from "react";

const dicebox = lazy(() => import("./dicebox"));

const DiceThrowing: React.FC = () => {
  const [Dicebox, setDicebox] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    setDicebox(dicebox);
  }, []);

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
