import type { ReactNode } from "react";

export default function Test<T>(props: {
  data: boolean;
  array: T[];
  value: number;
  children?: ReactNode;
}) {
  return (
    <div className="whatevs">
      value: {props.value}
      data: {props.data}
      {props.array.map((value, i) => {
        return <span key={i}>{JSON.stringify(value)}</span>;
      })}
      {props.children}
    </div>
  );
}
