import Icon from "./Icon";

function CourseToolbar({
  searchText,
  setSearchText,
  category,
  setCategory,
  level,
  setLevel,
  sortBy,
  setSortBy,
  categories,
  levels,
  resultCount,
  hasActiveFilters,
  clearFilters,
}) {
  return (
    <div className="course-toolbar">
      <div className="toolbar-main">
        <label className="search-control">
          <span className="sr-only">Search courses</span>
          <Icon name="search" size={20} />
          <input
            type="search"
            placeholder="Search courses, topics, or instructors"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          {searchText && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchText("")}
            >
              <Icon name="close" size={17} />
            </button>
          )}
        </label>

        <div className="filter-controls" aria-label="Course filters">
          <label className="select-control">
            <span className="sr-only">Filter by category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All categories" : item}
                </option>
              ))}
            </select>
          </label>

          <label className="select-control">
            <span className="sr-only">Filter by level</span>
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              {levels.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All levels" : item}
                </option>
              ))}
            </select>
          </label>

          <label className="select-control sort-control">
            <span className="sr-only">Sort courses</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured first</option>
              <option value="title">Course name</option>
              <option value="duration">Shortest first</option>
            </select>
          </label>
        </div>
      </div>

      <div className="toolbar-meta">
        <p aria-live="polite">
          <strong>{resultCount}</strong> {resultCount === 1 ? "course" : "courses"} available
        </p>
        {hasActiveFilters && (
          <button className="clear-filters" type="button" onClick={clearFilters}>
            Clear all filters
            <Icon name="close" size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseToolbar;
