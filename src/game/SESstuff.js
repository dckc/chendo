// @ts-check

export const assert = (cond, msg) => {
  if (!cond) {
    throw Error(msg);
  }
};

const { freeze: harden } = Object; // IOU

export { harden };
