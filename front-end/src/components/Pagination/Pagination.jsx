import ReactPaginate from 'react-paginate';

import './Pagination.css';

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setCurrentPage(page);
  };

  return (
    <div className='pagination-container'>
      <ReactPaginate
        breakLabel='...'
        nextLabel='Trang kế'
        previousLabel='Trang trước'
        onPageChange={handlePageClick}
        pageCount={totalPages}
        forcePage={currentPage - 1}
        pageClassName='page-item'
        pageLinkClassName='page-link'
        previousClassName='page-item'
        previousLinkClassName='page-link'
        nextClassName='page-item'
        nextLinkClassName='page-link'
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName='pagination'
        activeClassName='active'
      />
    </div>
  );
}
