function generatePagination(currentPage, totalPages, siblingCount = 2) {
  pass;
}

const Pagination = ({
  itemsPerPage,
  totalItems,
  setCurrentPage,
  currentPage,
}) => {
  const pageNumbers = [];

  // Fill in page numbers by dividing the total page to items per page
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber, e) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <a
              onClick={(e) => paginate(number, e)}
              href="!#"
              className="page-link"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
