/**
 * Filters an array of card variants based on specific display rules.
 *
 * This function implements a specialized filtering logic where:
 * 1. All items with type 'normal' or 'parallel' are always included
 * 2. Remaining slots (up to maxLength) are filled with 'other' type items where:
 *    - If there are more 'other' items with quantity > 0 than remaining slots,
 *      all positive quantity 'other' items are included (exceeding maxLength)
 *    - Otherwise, remaining slots are filled first with positive quantity items,
 *      then with zero quantity items in original order
 *
 * @param {Array<{
 *   name: string,
 *   quantity: number,
 *   type: 'normal' | 'parallel' | 'other'
 * }>} array - Array of card variants to filter
 * @param {number} [maxLength=5] - Maximum number of items to return, unless there are
 *                                more 'other' type items with quantity > 0
 *
 * @returns {Array<{
 *   name: string,
 *   quantity: number,
 *   type: 'normal' | 'parallel' | 'other'
 * }>} Filtered array following the rules above
 *
 * @example
 * const variants = [
 *   { name: "Normal", quantity: 0, type: "normal" },
 *   { name: "Reverse Holo", quantity: 0, type: "parallel" },
 *   { name: "Championship", quantity: 2, type: "other" },
 *   { name: "Staff", quantity: 0, type: "other" }
 * ];
 * filterArray(variants, 3);
 * // Returns: [
 * //   { name: "Normal", quantity: 0, type: "normal" },
 * //   { name: "Reverse Holo", quantity: 0, type: "parallel" },
 * //   { name: "Championship", quantity: 2, type: "other" }
 * // ]
 */
export function variantFilter(array, maxLength = 5) {
  if (array.length === 0) return [];

  // First, separate base items (normal/parallel) from others
  const baseItems = array.filter(
    (item) => item.type === "normal" || item.type === "parallel",
  );
  const otherItems = array.filter((item) => item.type === "other");

  // Count how many slots we have left after including base items
  const remainingLength = Math.max(0, maxLength - baseItems.length);

  // Count positive quantity items in the other items
  const positiveCount = otherItems.reduce(
    (count, item) => count + (item.quantity > 0 ? 1 : 0),
    0,
  );

  // If more than remainingLength positive quantity items in others, return base + all positive others
  if (positiveCount > remainingLength) {
    return [...baseItems, ...otherItems.filter((item) => item.quantity > 0)];
  }

  // Otherwise, fill remaining slots with other items
  const result = [...baseItems];
  let remainingSlots = remainingLength - positiveCount; // slots for zero-quantity items

  for (const item of otherItems) {
    if (item.quantity > 0) {
      result.push(item);
    } else if (remainingSlots > 0) {
      result.push(item);
      remainingSlots--;
    }
  }

  return result;
}
