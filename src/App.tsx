import * as React from "react";
import "./styles.css";

import "baconjs";
import { repeatedly, Observable } from "baconjs";
import { useState, useEffect, useMemo } from "react";

function useInit<T>(initValue: () => T) {
  return useMemo(initValue, []);
}

function useEvent<T>(streamCreator: () => Observable<T>) {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    console.log(1);
    const stream = streamCreator();
    const unsub = stream.onValue(value => setValue(value));
    return () => unsub();
  }, []);

  return value;
}

export default function App() {
  const repeater = useInit(() => repeatedly(1000, [1, 2, 3, 4, 5]));

  const value = useEvent(() => repeater);

  const value2 = useEvent(() =>
    repeater.map(i => i + 100).filter(i => i > 103)
  );

  return (
    <div className="App">
      <h1>
        Hello CodeSandbox {value} {value2}
      </h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
