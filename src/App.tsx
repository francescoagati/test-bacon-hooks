import * as React from "react";
import "./styles.css";

import "baconjs";
import { repeatedly, Observable, Bus } from "baconjs";
import { useState, useEffect, useMemo } from "react";

function useEventCallback<T>(
  streamCreator: () => Observable<T>,
  cb: (value: T) => void
) {
  useEffect(() => {
    const stream = streamCreator();
    const unsub = stream.onValue(cb);
    return () => {
      unsub();
    };
  }, []);
}

function useEventValue<T>(streamCreator: () => Observable<T>, initValue?: T) {
  const [value, setValue] = useState<T>(initValue);

  useEffect(() => {
    const stream = streamCreator();
    const unsub = stream.onValue(value => {
      setValue(value);
    });

    return () => {
      console.log(1);
      unsub();
    };
  }, []);

  return value;
}

export default function App() {
  const [counter2, setCounter2] = useState(0);

  const counterBus = useMemo(() => new Bus<number>(), []);
  const counter = useEventValue(() => counterBus, 0);

  const repeater = useMemo(() => {
    return repeatedly(1000, [1, 2, 3, 4, 5]);
  }, []);

  useEventCallback(
    () => repeatedly(5000, [100, 101, 102]),
    value => setCounter2(value)
  );

  const value = useEventValue(() => repeater);

  const value2 = useEventValue(() =>
    repeater.map(i => i + 100).filter(i => i > 103)
  );

  //onClick={() => counterBus.push(counter + 1)}

  return (
    <div className="App">
      <h1>
        Hello CodeSandbox {value} {value2} {counter}{" "}
      </h1>
      <h2>Start editing to see some magic happen!</h2>
      {counter2}
    </div>
  );
}
