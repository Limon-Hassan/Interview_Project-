'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientProvider = () => {
  const [news, setNews] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    language: '',
    creator: '',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [selectedNews, setSelectedNews] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); 
  const limit = 20;

  const fetchNews = async () => {
    setLoading(true); 
    try {
      const query = new URLSearchParams({
        ...filters,
        page: pageNum,
        limit,
      }).toString();

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news?${query}`);

      setNews(res.data.news || []);
      setTotalPages(Math.ceil((res.data.total || 0) / limit));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchNews();
  }, [filters, pageNum]);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPageNum(1);
  };

  const goPrev = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = () => {
    if (pageNum < totalPages) setPageNum(pageNum + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-gray-500 text-3xl font-bold mb-6">News Dashboard</h1>

      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by Title"
          name="search"
          value={filters.search}
          onChange={handleChange}
          className="border-gray-500 border placeholder:text-gray-500 text-gray-500 p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Author / Creator"
          name="creator"
          value={filters.creator}
          onChange={handleChange}
          className="border-gray-500 placeholder:text-gray-500 border text-gray-500 p-2 rounded w-full"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="border-gray-500 text-gray-500 border p-2 rounded w-full"
        >
          <option value="">All Categories</option>
          <option value="sports">Sports</option>
          <option value="politics">Politics</option>
          <option value="entertainment">Entertainment</option>
          <option value="technology">Technology</option>
        </select>
        <select
          name="country"
          value={filters.country}
          onChange={handleChange}
          className="border-gray-500 text-gray-500 border p-2 rounded w-full"
        >
          <option value="">All Countries</option>
          <option value="united states of america">USA</option>
          <option value="canada">Canada</option>
        </select>
        <select
          name="language"
          value={filters.language}
          onChange={handleChange}
          className="border-gray-500 text-gray-500 border p-2 rounded w-full"
        >
          <option value="">All Languages</option>
          <option value="english">English</option>
          <option value="french">French</option>
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="border-gray-500 border placeholder:text-gray-500 text-gray-500 p-2 rounded w-full"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="border-gray-500 border placeholder:text-gray-500 text-gray-500 p-2 rounded w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded shadow animate-pulse h-64 flex flex-col"
              >
                <div className="h-48 bg-gray-300 rounded-t"></div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))
          : news.map(item => (
              <div
                key={item._id}
                className="bg-white rounded shadow cursor-pointer hover:shadow-lg transition overflow-hidden"
                onClick={() => setSelectedNews(item)}
              >
                <img
                  src={item.image_url || '/missing.webp'}
                  alt={item.title}
                  className="h-60 w-full object-cover rounded-t hover:scale-105 transition-all duration-300"
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg mb-2 text-gray-500">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    {item.creator?.join(', ')}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(item.pubDate).toLocaleDateString()} -{' '}
                    {item.source_name}
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={goPrev}
          disabled={pageNum === 1}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-white border rounded text-gray-700">
          Page {pageNum} of {totalPages}
        </span>
        <button
          onClick={goNext}
          disabled={pageNum === totalPages}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>

      {selectedNews && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-3xl w-full relative">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-3 right-3 text-white bg-red-400 rounded-full py-2 px-3.5 hover:bg-red-500 transition cursor-pointer"
            >
              X
            </button>
            <h2 className="font-bold text-2xl mb-2 text-gray-500 w-162.5">
              {selectedNews.title}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {selectedNews.creator?.join(', ')} -{' '}
              {new Date(selectedNews.pubDate).toLocaleDateString()}
            </p>
            <p className="text-gray-500 mb-2">{selectedNews.source_name}</p>
            <img
              src={selectedNews.image_url || '/missing.webp'}
              alt={selectedNews.title}
              className="w-full h-auto object-cover rounded mb-4"
            />
            <p className="text-gray-700">
              {selectedNews.content || selectedNews.description}
            </p>
            <a
              href={selectedNews.link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline mt-4 inline-block"
            >
              Read full article
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProvider;
