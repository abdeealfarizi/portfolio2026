import config from "../../keystatic.config";

// Local mode reads and writes the filesystem, which only makes sense on your own machine.
// On the live site the admin stays off until it is connected to GitHub (see README).
export const keystaticEnabled = process.env.NODE_ENV === "development" || config.storage.kind === "github";
