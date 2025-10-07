export default function SearchBar({
  author,
  setAuthor,
  title,
  setTitle,
  darkMode,
  onSearch,
  onRandom,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <label htmlFor="author-input" className="text-base font-medium w-16 text-right">Author:</label>
        <input
          id="author-input"
          type="text"
          placeholder="Search for an author e.g. Emily Dickenson"
          onChange={(e) => setAuthor(e.target.value)}
          value={author}
          className={`px-5 py-2.5 text-base rounded-lg border border-indigo-500 min-w-[250px] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
        />
      </div>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <label htmlFor="title-input" className="text-base font-medium w-16 text-right">Title:</label>
        <input
          id="title-input"
          type="text"
          placeholder="Search for a specific poem title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className={`px-5 py-2.5 text-base rounded-lg border border-indigo-500 min-w-[250px] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
        />
      </div>
      <div className="flex items-center justify-center gap-5 flex-wrap mt-4">
        <button
          onClick={() => onSearch(author, title)}
          className={`rounded-lg border border-transparent px-5 py-2.5 text-base font-medium cursor-pointer transition-colors hover:border-indigo-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
        >
          Search
        </button>
        <button
          aria-label="Find for a random poem"
          onClick={() => {
            onRandom();
            setAuthor("");
            setTitle("");
          }}
          className={`rounded-lg border border-transparent px-5 py-2.5 text-base font-medium cursor-pointer transition-colors hover:border-indigo-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
        >
          Randomize
        </button>
      </div>
    </div>
  );
}
