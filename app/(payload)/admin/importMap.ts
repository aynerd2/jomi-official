/**
 * Maps the custom admin components declared in payload.config.ts to their
 * implementations.
 *
 * Payload generates this with `payload generate:importmap`, but that CLI
 * produces no output on this machine, so it is maintained by hand. Add an entry
 * here whenever a new component path goes into the config, using the exact
 * "path#export" string from the config as the key.
 */
import { AccountLinks } from "@/components/admin/AccountLinks";
import { Icon } from "@/components/admin/Icon";
import { Logo } from "@/components/admin/Logo";

export const importMap = {
  "@/components/admin/Logo#Logo": Logo,
  "@/components/admin/Icon#Icon": Icon,
  "@/components/admin/AccountLinks#AccountLinks": AccountLinks,
};
