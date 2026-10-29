// Dev server may read the Scout GLBs in ../assets/helmet-scout (web/src/scout.js); everything else stays as before.
export default { server: { fs: { allow: ['..'] } } };
