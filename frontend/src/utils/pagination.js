/**
 * Generates a pagination range with ellipses for large page sets.
 *
 * @param {number} currentPage - The current active page (1-based index).
 * @param {number} totalPages - Total number of pages.
 * @param {number} siblingCount - Number of pages to show on each side of current page.
 * @returns {(number|string)[]} Array of page numbers and "..." placeholders.
 */
const generatePagination = (currentPage, totalPages, siblingCount = 2) => {
  const totalSlots = siblingCount * 2 + 5;

  // Case 1: Show all pages if totalPages is small
  // return an array of every page number (e.g., [1, 2, 3, ..., totalPages]).
  // Reserve space for the first/last pages, the current page's sibling
  // window, and up to two ellipses; smaller sets can display every page.
  if (totalPages <= totalSlots) {
    return Array.from(
      { length: totalPages }, // array-like object
      (_, i) => i + 1, // mapping function
    );
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPages - 1,
  );

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  const pagination = [];

  // Always show first page
  pagination.push(1);

  // Show left ellipsis if needed
  if (showLeftEllipsis) {
    pagination.push("...");
  }

  // Pages between ellipses
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pagination.push(i);
  }

  // Show right ellipsis if needed
  if (showRightEllipsis) {
    pagination.push("...");
  }

  // Always show last page
  pagination.push(totalPages);

  return pagination;
};

export default generatePagination;
