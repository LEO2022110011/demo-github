// permissionsUtils.js

// Define permissions mapping for convenience
const permissionsMap = {
  readable: {
    view: "View",
    list: "List",
    properties: "View Properties",
  },
  writable: {
    download: "Download",
    upload: "Upload",
    delete: "Delete",
    rename: "Rename",
    move: "Move",
    copy: "Copy",
    share: "Share",
  },
};

/**
 * Get allowed actions based on resolved permissions.
 * @param {Object} permissions - The permissions object.
 * @returns {Object} - Allowed actions for readable and writable.
 */
export function getAllowedActions(permissions) {
  const allowedActions = [];

  if (permissions.readable) {
    allowedActions.push(...Object.values(permissionsMap.readable));
  }
  if (permissions.writable) {
    allowedActions.push(...Object.values(permissionsMap.writable));
  }
  

  return allowedActions;
}

/**
 * Resolves the lowest permission level for selected items.
 * @param {Object} selectedItems - Object representing selected items and their permissions.
 * @returns {Object} - Permissions object with resolved lowest permissions (read/write).
 */
export function resolvePermissions(selectedItems) {
    // Default resolvedPermissions starts with `true` for both, as we want to keep permissions only if all items have them

    if (Object.keys(selectedItems).length === 0) return { readable: true, writable: false };

    const resolvedPermissions = { readable: true, writable: true };

    for (const item of Object.values(selectedItems)) {
        // For each item, adjust resolvedPermissions to the lowest permission level
        resolvedPermissions.readable = resolvedPermissions.readable && item.permissions.readable;
        resolvedPermissions.writable = resolvedPermissions.writable && item.permissions.writable;
    }

    return resolvedPermissions;
}