/**
 * Combines a list of class names into a single string, filtering out any falsy values.
 *
 * @param {...(string|false|null|undefined)} args - A list of class name arguments, which may include falsy values like `false`, `null`, or `undefined`.
 * @returns {string} A string of valid class names, separated by a space.
 *
 * @example
 * // Returns 'btn btn-primary'
 * cn('btn', 'btn-primary', false, null, undefined);
 *
 * @example
 * // Returns 'text-lg font-bold'
 * cn('text-lg', undefined, 'font-bold');
 */
export function cn(...args) {
  return args.filter(Boolean).join(" ");
}
