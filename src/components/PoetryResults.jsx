export default function PoetryResults({
  poetData,
  pageNumber,
  setPageNumber,
  setPoemToShow,
  setShowPoemDetails,
}) {
  const poemsPerPage = 5;
  const startIndex = (pageNumber - 1) * poemsPerPage;
  const currentPoems = poetData
    ? poetData.slice(startIndex, startIndex + poemsPerPage)
    : [];
  const totalPages = poetData ? Math.ceil(poetData.length / poemsPerPage) : 1;

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const renderPoems = () => (
    <>
      {currentPoems.map((poem, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h3>
            {poem.title}{" "}
            <button
              className="info-button"
              onClick={() => {
                setPoemToShow(poem);
                setShowPoemDetails(true);
              }}
              aria-label={`More details about ${poem.title}`}
            >
              &#9432;
            </button>
          </h3>
          <pre>{poem.lines.join("\n")}</pre>
        </div>
      ))}
    </>
  );

  const renderPageNav = () => (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <button
        style={{ marginRight: "20px" }}
        onClick={handlePrevPage}
        disabled={pageNumber === 1}
      >
        Previous
      </button>
      <span>
        Page {pageNumber} of {totalPages}
      </span>
      <button
        style={{ marginLeft: "20px" }}
        onClick={handleNextPage}
        disabled={pageNumber === totalPages}
      >
        Next
      </button>
    </div>
  );

  if (!poetData) {
    return <p>No poems found.</p>;
  }

  return (
    <>
      <h2>Poems by {poetData[0].author}</h2>
      {renderPoems()}
      {renderPageNav()}
    </>
  );
}
