import { deepFreeze } from "grommet/utils";
import { css } from "styled-components";

export const theme = deepFreeze({
  global: {
    colors: {
      brand: "#000075",
      focus: "#42d4f4",
      "accent-1": "#42d4f4",
      "accent-2": "#f032e6",
      "accent-3": "#81FCED",
      "accent-4": "#ffe119",
      "neutral-1": "#00873D",
      "neutral-2": "#3D138D",
      "neutral-3": "#00739D",
      "neutral-4": "#800000",
      "status-critical": "#e6194b",
      "status-error": "#e6194b",
      "status-warning": "#f58231",
      "status-ok": "#3cb44b",
    },
  },

  button: {
    border: {
      radius: "9px",
    },
  },
  formField: {
    extend: () => css`
      white-space: nowrap;
    `,
  },
});
