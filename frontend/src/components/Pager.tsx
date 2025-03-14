import { useState } from "react";

const Pager: React.FC<{
  maxShown?: number;
  count: number;
  defaultPage?: number;
  onPageChange: (page: number) => void;
}> = ({ maxShown = 3, count, defaultPage = 0, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(defaultPage);

  const changePage = (page: number) => {
    if (page < 0 || page >= count) return;
    setCurrentPage(page);
    onPageChange(page);
  };

  const getPages = () => {
    if (count <= maxShown + 2)
      return Array.from({ length: count }, (_, i) => i);

    const pages = new Set<number>();
    pages.add(0);
    pages.add(count - 1);

    let left = Math.max(1, currentPage - (maxShown - 1) / 2);
    let right = Math.min(count - 2, currentPage + (maxShown - 1) / 2);

    if (currentPage === 0) right = left + maxShown - 2;
    if (currentPage === count - 1) left = right - maxShown + 2;

    for (let i = left; i <= right; i++) pages.add(i);

    return [...pages].sort((a, b) => a - b);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px",
      }}
    >
      <button
        type="button"
        style={{
          padding: "5px 10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          background: "#f5f5f5",
          cursor: currentPage === 0 ? "not-allowed" : "pointer",
        }}
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 0}
      >
        &lt;
      </button>

      {getPages().map((page, idx, arr) => (
        <div key={page} style={{ display: "flex", alignItems: "center" }}>
          {idx > 0 && page !== arr[idx - 1] + 1 && (
            <span style={{ padding: "0 5px" }}>...</span>
          )}
          <button
            type="button"
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              background: page === currentPage ? "#ff6b00" : "#fff",
              color: page === currentPage ? "#fff" : "#333",
              fontWeight: page === currentPage ? "bold" : "normal",
              cursor: "pointer",
            }}
            onClick={() => changePage(page)}
          >
            {page + 1}
          </button>
        </div>
      ))}

      <button
        type="button"
        style={{
          padding: "5px 10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          background: "#f5f5f5",
          cursor: currentPage === count - 1 ? "not-allowed" : "pointer",
        }}
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === count - 1}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pager;
