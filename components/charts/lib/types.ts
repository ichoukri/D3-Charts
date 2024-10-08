export type DataKey<T> = string | number | ((obj: T) => any);

export interface BaseAxisProps {
  type?: "number" | "category";
  dataKey?: DataKey<any>;
  hide?: boolean;
  axisLine?: boolean;
  tickFormatter?: (value: any, index: number) => string;
  unit?: string | number;
  className?: string;
}