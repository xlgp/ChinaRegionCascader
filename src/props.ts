export const props = {
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    level: {
      //返回层级，省市县分别对应1,2,3
      type: Number,
      default: 2,
    },
    //code 必须
    code: { type: String },
    label: { type: Array },
  };