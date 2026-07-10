/** Shared Module Federation config for React singletons across host + remotes. */
export const sharedReact = {
  react: {
    singleton: true,
    requiredVersion: "^19.0.0",
  },
  "react-dom": {
    singleton: true,
    requiredVersion: "^19.0.0",
  },
};
