export interface RegionType {
    code: string;
    name: string;
  }

  export interface Option {
    value: string;
    label: string;
    loading?: boolean;
    isLeaf?: boolean;
    children?: Option[];
  }