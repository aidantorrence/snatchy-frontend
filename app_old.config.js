import "dotenv/config";

import production from "./app.production.json";
import development from "./app.development.json";

// export default ({ config }) => {
//   if (process.env.ENV === "production" || process.env.ENV === "preview") {
//     return {
//       ...config,
//       ...production.expo,
//     };
//   } else {
//     return {
//       ...config,
//       ...development.expo,
//     };
//   }
// };

// export default ({ config }) => {
//   return {
//     ...config,
//     extra: {
//       "jumbotron": "holoa"
//     }
//   }
// };
export default ({ config }) => {
  if (process.env.ENV === "production" || process.env.ENV === "preview") {
  return {
    ...config,
    expo: {
      extra: {
      ...production.expo.extra,
        eas: {
          projectId: "d736cba8-c2d4-4a7f-9e2a-e3e98bf1996e",
        },
      },
    },
  };
  } else {
    return {
      ...config,
      expo: {
        extra: {
        ...development.expo.extra,
          eas: {
            projectId: "d736cba8-c2d4-4a7f-9e2a-e3e98bf1996e",
          },
        },
      },
    };
  }
};
