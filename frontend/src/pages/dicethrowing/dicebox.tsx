import DiceBox from "@3d-dice/dice-box";
import { AdvancedRoller } from "@3d-dice/dice-ui";
import { useEffect, useRef, useState } from "react";
import "./dicebox.css";

const Dicebox: React.FC = () => {
  const isInitialized = useRef(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    //bcs it runs on strict mode, it will run only once
    if (isInitialized.current) return; // Skip if already initialized
    isInitialized.current = true;

    const Box = new DiceBox({
      container: "#dice-box",
      assetPath: "/assets/",
      offScreen: true,
      scale: 6,
      theme: "default",
    });
    Box.init().then(() => {
      const Roller = new AdvancedRoller({
        target: "#dice-box",
        onSubmit: (notation: string) => {
          setResult("");
          Box.roll(notation);
        },
        onClear: () => {
          setResult("");
          Box.clear();
        },
        onReroll: (rolls: []) => {
          // loop through parsed roll notations and send them to the Box
          for (const roll of rolls) {
            Box.add(roll);
          }
        },
        //biome-ignore lint/suspicious/noExplicitAny: This is a third-party library, no clue of the type
        onResults: (results: any) => {
          setResult(results.value);
        },
      });
      Box.onRollComplete = (results: object) => {
        Roller.handleResults(results);
      };
    });
  }, []);

  return (
    <div className="w-4/5 h-full ">
      <div className=" tabletop relative h-full w-full">
        <div id="dice-box" />
        {result !== "" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-3xl text-white bg-black bg-opacity-50 p-2 rounded-lg">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dicebox;
