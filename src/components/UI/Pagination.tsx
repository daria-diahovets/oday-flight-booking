import classes from '../../styles/Pagination.module.scss';
import arrow from '../../assets/icons/arrow.svg';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageItems(current: number, total: number): (number | '...')[] {
  if (current <= 3) {
    return Array.from({ length: Math.min(3, total) }, (_, i) => i + 1);
  }
  if (current === total) {
    return [1, '...', total];
  }
  return [1, '...', current, '...', total];
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={classes.pagination}>
      <button
        type="button"
        className={`block bounce-hover ${classes.item}`}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <img src={arrow} alt="" />
      </button>

      {getPageItems(page, totalPages).map((item, index) =>
        item === '...' ? (
          <span key={`ellipsis-${index}`} className={`block ${classes.item}`}>
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`block bounce-hover ${classes.item} ${item === page ? classes.active : ''}`}
            disabled={item === page}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className={`block bounce-hover ${classes.item} ${classes.next}`}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <img src={arrow} alt="" />
      </button>
    </div>
  );
};

export default Pagination;
