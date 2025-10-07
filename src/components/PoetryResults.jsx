export default function PoetryResults({
  poetData,
  pageNumber,
  setPageNumber,
  darkMode,
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
        <div key={index} className="mb-5">
          <h3 className="text-2xl font-semibold">
            {poem.title}{" "}
            <button
              className={`rounded-full border border-transparent px-5 py-2.5 text-base cursor-pointer transition-colors hover:border-indigo-500 ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
              onClick={() => {
                setPoemToShow(poem);
                setShowPoemDetails(true);
              }}
              aria-label={`More details about ${poem.title}`}
            >
              &#9432;
            </button>
          </h3>
          <pre className="mt-2 whitespace-pre-wrap">
            {poem.lines.join("\n")}
          </pre>
        </div>
      ))}
    </>
  );

  const renderPageNav = () => (
    <div className="mt-5 text-center">
      <button
        className={`rounded-lg border border-transparent px-5 py-2.5 text-base font-medium cursor-pointer transition-colors hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed mr-5 ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
        onClick={handlePrevPage}
        disabled={pageNumber === 1}
      >
        Previous
      </button>
      <span className="mx-2">
        Page {pageNumber} of {totalPages}
      </span>
      <button
        className={`rounded-lg border border-transparent px-5 py-2.5 text-base font-medium cursor-pointer transition-colors hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ml-5 ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
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
      <h2 className="text-3xl font-bold mt-8 mb-6">
        Poems by {poetData[0].author}
      </h2>
      {renderPoems()}
      {renderPageNav()}
    </>
  );
}
