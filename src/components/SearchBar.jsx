function SearchBar({ searchText, setSearchText }) {
  return (
    <div className="mx-auto mt-6 max-w-6xl px-6">
      <input
        type="text"
        placeholder="Search courses by title or category..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

export default SearchBar;