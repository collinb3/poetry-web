import { useEffect, useState } from "react";
import "./App.css";
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

  useEffect(() => {
    fetchPoetData(author, title, setPoetData, setError, setLoading);
  }, []);

  const handleMoreDetails = () => (
    <div>
      <h2>Poem Details</h2>
      <button onClick={() => setShowPoemDetails(false)}>Back to Results</button>
      <h3>{poemToShow.title}</h3>
      <p>Author: {poemToShow.author}</p>
      <p>Line Count: {poemToShow.linecount}</p>
      <pre>{poemToShow.lines.join("\n")}</pre>
    </div>
  );

  return (
    <>
      <div className="App">
        <h1>Welcome to the poetry database!</h1>
        <div>
          <SearchBar
            author={author}
            setAuthor={setAuthor}
            title={title}
            setTitle={setTitle}
            onSearch={() => {
              fetchPoetData(author, title, setPoetData, setError, setLoading);
              setPageNumber(1);
            }}
            onRandom={() => {
              fetchRandomPoem(setPoetData, setError, setLoading);
              setPageNumber(1);
            }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <div>
          {loading && <p>Loading...</p>}
          {poetData && !loading && !showPoemDetails && (
            <div>
              <PoetryResults
                poetData={poetData}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                handleMoreDetails={handleMoreDetails}
                setPoemToShow={setPoemToShow}
                setShowPoemDetails={setShowPoemDetails}
              />
            </div>
          )}
          {showPoemDetails && handleMoreDetails()}
        </div>
      </div>
    </>
  );
}

export default App;
