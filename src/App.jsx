import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import PoetryResults from "./components/PoetryResults.jsx";
import { fetchPoetData, fetchRandomPoem } from "./services/ApiService.js";

function App() {
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("Emily Dickinson");
  const [title, setTitle] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [poetData, setPoetData] = useState(null);
  const [showPoemDetails, setShowPoemDetails] = useState(false);
  const [poemToShow, setPoemToShow] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchPoetData(author, title, setPoetData, setError, setLoading);
  }, []);

  const handleMoreDetails = () => (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-4">Poem Details</h2>
      <button
        onClick={() => setShowPoemDetails(false)}
        className={`rounded-lg border border-transparent px-5 py-2.5 text-base font-medium cursor-pointer transition-colors hover:border-indigo-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
      >
        Back to Results
      </button>
      <h3 className="text-2xl font-semibold mt-4">{poemToShow.title}</h3>
      <p className="mt-2">Author: {poemToShow.author}</p>
      <p className="mt-2">Line Count: {poemToShow.linecount}</p>
      <pre className="mt-4 whitespace-pre-wrap">{poemToShow.lines.join("\n")}</pre>
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center min-w-[320px] ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-4 right-4 p-3 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      <div className="max-w-5xl mx-auto p-8 text-center">
        <h1 className="text-5xl font-bold mb-8">Welcome to the poetry database!</h1>
        <div>
          <SearchBar
            author={author}
            setAuthor={setAuthor}
            title={title}
            setTitle={setTitle}
            darkMode={darkMode}
            onSearch={() => {
              fetchPoetData(author, title, setPoetData, setError, setLoading);
              setPageNumber(1);
            }}
            onRandom={() => {
              fetchRandomPoem(setPoetData, setError, setLoading);
              setPageNumber(1);
            }}
          />
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        <div>
          {loading && <p className="mt-4">Loading...</p>}
          {poetData && !loading && !showPoemDetails && (
            <div>
              <PoetryResults
                poetData={poetData}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                darkMode={darkMode}
                handleMoreDetails={handleMoreDetails}
                setPoemToShow={setPoemToShow}
                setShowPoemDetails={setShowPoemDetails}
              />
            </div>
          )}
          {showPoemDetails && handleMoreDetails()}
        </div>
      </div>
    </div>
  );
}

export default App;
