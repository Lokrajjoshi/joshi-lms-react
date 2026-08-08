import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "./Icon";

const emptyArticle = { name: "", description: "" };

function FileSystemDemo() {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(emptyArticle);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/articles")
      .then((response) => setArticles(response.data))
      .catch(() => setMessage("Start the Express server to load file-system records."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    setArticle((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setArticle(emptyArticle);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!article.name.trim() || !article.description.trim()) {
      setMessage("Enter the article name and description.");
      return;
    }

    try {
      const response = editingId
        ? await axios.put(`/api/articles/${editingId}`, article)
        : await axios.post("/api/articles", article);

      setArticles((current) => editingId
        ? current.map((item) => (item.id === editingId ? response.data : item))
        : [...current, response.data]);
      setMessage(editingId ? "Article updated in articles.json." : "Article saved in articles.json.");
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save the article.");
    }
  };

  const editArticle = (selectedArticle) => {
    setArticle({ name: selectedArticle.name, description: selectedArticle.description });
    setEditingId(selectedArticle.id);
    setMessage("Editing the selected article.");
    document.querySelector("#file-system")?.scrollIntoView({ behavior: "smooth" });
  };

  const deleteArticle = async (selectedArticle) => {
    if (!window.confirm(`Delete ${selectedArticle.name}?`)) return;
    try {
      await axios.delete(`/api/articles/${selectedArticle.id}`);
      setArticles((current) => current.filter((item) => item.id !== selectedArticle.id));
      if (editingId === selectedArticle.id) resetForm();
      setMessage("Article deleted from articles.json.");
    } catch {
      setMessage("Unable to delete the article.");
    }
  };

  return (
    <section className="section bg-slate-50 scroll-mt-20" id="file-system" aria-labelledby="file-system-title">
      <div className="container">
        <div className="mb-9 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="eyebrow-row">
              <span className="eyebrow">File system CRUD</span>
              <span className="section-number">7</span>
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl" id="file-system-title">
              Learning article file system
            </h2>
            <p className="max-w-2xl leading-7 text-slate-600">
              Manage LMS articles using React, Express and Node.js file-system storage.
            </p>
          </div>
          <span className="w-fit rounded-full bg-violet-100 px-4 py-2 text-sm font-bold text-violet-700">
            {articles.length} {articles.length === 1 ? "record" : "records"} in articles.json
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <form className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 lg:sticky lg:top-24" onSubmit={handleSubmit}>
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700"><Icon name="book" /></span>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{editingId ? "Update article" : "Add learning article"}</h3>
                <p className="text-sm text-slate-500">Saved through the Node.js fs module.</p>
              </div>
            </div>

            <div className="field">
              <label htmlFor="article-name">Article name</label>
              <input id="article-name" name="name" value={article.name} onChange={handleChange} placeholder="e.g. JavaScript Functions" />
            </div>
            <div className="field">
              <label htmlFor="article-description">Description</label>
              <textarea id="article-description" name="description" value={article.description} onChange={handleChange} placeholder="Enter a short learning summary" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button className="button button-primary" type="submit">
                {editingId ? "Update Article" : "Save Article"}
                <Icon name="arrow-right" size={17} />
              </button>
              <button className="button button-secondary" type="button" onClick={resetForm}>
                {editingId ? "Cancel Edit" : "Reset"}
              </button>
            </div>
            {message && <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700" role="status">{message}</p>}
          </form>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Saved learning articles</h3>
              <span className="text-sm font-semibold text-slate-500">File CRUD</span>
            </div>

            {loading ? (
              <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">Loading articles...</p>
            ) : articles.length === 0 ? (
              <div className="empty-state">
                <span><Icon name="book" size={26} /></span>
                <h3>No articles saved</h3>
                <p>Use the form to create the first file-system record.</p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {articles.map((item) => (
                  <article className="flex min-h-60 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50" key={item.id}>
                    <div className="mb-5 flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 font-bold text-indigo-700">{item.id}</span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">JSON file</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                      <button className="button button-secondary" type="button" onClick={() => editArticle(item)}>Edit</button>
                      <button className="button min-h-11 border border-red-200 bg-red-50 font-bold text-red-700 hover:bg-red-100" type="button" onClick={() => deleteArticle(item)}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FileSystemDemo;
