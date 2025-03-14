import { lazy, Suspense, useState } from "react";
import Pager from "../../../components/Pager";

const TextEditor = lazy(() => import("../../../components/CKEditor/CKEditor"));

const Notes: React.FC = () => {
  const [notes, setNotes] = useState("");
  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading editor...</div>}>
        <TextEditor value={notes} onChange={(val) => setNotes(val)} />
      </Suspense>
      {/*pager*/}
      <div className="flex justify-center">
        <Pager
          count={10}
          onPageChange={(val) => {
            console.log(val);
          }}
        />
      </div>
    </div>
  );
};

export default Notes;
