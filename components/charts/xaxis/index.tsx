import React from "react";
import { DataKey } from "../lib/types";

export interface BaseAxisProps {
  type?: "number" | "category";
  dataKey?: DataKey<any>;
  hide?: boolean;
  axisLine?: boolean;
  tickFormatter?: (value: any, index: number) => string;
  unit?: string | number;
  className?: string;
}

export const Xaxis = () => {
  return <div>Xaxis</div>;
};
