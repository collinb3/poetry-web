import "../index.css";

export default function SearchBar({
  author,
  setAuthor,
  title,
  setTitle,
  onSearch,
}) {
  return (
    <div>
      <label htmlFor="author-input">Author: </label>
      <input
        id="author-input"
        type="text"
        placeholder="Search for an author e.g. Emily Dickenson"
        onChange={(e) => setAuthor(e.target.value)}
        value={author}
      />
      <label htmlFor="title-input">Title: </label>
      <input
        id="title-input"
        type="text"
        placeholder="Search for a specific poem title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <button onClick={() => onSearch(author, title)}>Search</button>
    </div>
  );
}
