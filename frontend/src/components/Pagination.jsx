import generatePagination from "../utils/pagination";
import "./Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  total,
  onPageChange,
}) => {
  // Pagination is hidden when there is only one page
  if (totalPages === 0) {
    return null;
  }

  // Calculate the index, for "Showing {firstIndex} - {lastIndex} of {total} properties"
  const firstIndex = Math.max((currentPage - 1) * itemsPerPage + 1, 1);
  const lastIndex = Math.min(currentPage * itemsPerPage, total);

  const pages = generatePagination(currentPage, totalPages);

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="pagination-container">
      <span className="pagination-info">
        Showing <strong>{firstIndex}</strong>-<strong>{lastIndex}</strong> of{" "}
        <strong>{total}</strong> properties
      </span>
      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={`page-item ${isPreviousDisabled ? "disabled" : ""}`}>
              <button
                type="button"
                className="page-link"
                disabled={isPreviousDisabled}
                onClick={() => onPageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {/* Pagination generation */}
            {pages.map((page, index) =>
              page === "..." ? (
                <li className="page-item disabled" key={index}>
                  <span className="page-link" aria-hidden="true">
                    ...
                  </span>
                </li>
              ) : (
                <li
                  className={`page-item ${page === currentPage ? "active" : ""}`}
                  key={index}
                >
                  <button
                    className="page-link"
                    type="button"
                    disabled={page === currentPage}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ),
            )}
            <li className={`page-item ${isNextDisabled ? "disabled" : ""}`}>
              <button
                type="button"
                className="page-link"
                disabled={isNextDisabled}
                onClick={
                  isNextDisabled
                    ? undefined
                    : () => onPageChange(currentPage + 1)
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
