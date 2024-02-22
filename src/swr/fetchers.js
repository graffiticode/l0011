import { postApiCompile } from "../lib/api";
export const compile = async ({ accessToken, id, data }) => {
  try {
    const index = Object.keys(data).length > 0 && 1 || 2; // Empty data so use full id.
    id = id.split("+").slice(0, index).join("+");  // Re-compile state with code id.
    const resp = await postApiCompile({ accessToken, id, data });
    return resp;
  } catch (x) {
    console.log("l0011 ./swr/fetchers/compile()");
    console.log(x.stack);
  }
};
