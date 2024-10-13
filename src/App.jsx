import { useState, useEffect, useRef, Component } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);  // To keep track of pagination
  const [searchQuery, setSearchQuery] = useState('');
  const input = useRef(null);

  console.log('component is loaded');
  const API_KEY = 'f0FwIL7QhLNTlZHqJdnfA75Qa6q5oj_7SZkpinS2zuE';

  const fetchImages = async (query, pageNum) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos/?client_id=${API_KEY}&query=${query}&page=${pageNum}`);
      const data = await response.json();
      setImages(prevImages => [...prevImages, ...data.results]);  // Append new images to existing list
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();  
    setImages([]);  
    setPage(1);     
    const query = encodeURIComponent(input.current.value.trim());
    setSearchQuery(query);  
    if (query) {
      fetchImages(query, 1);  
    }
  };

  
  const handleScroll = () => {
    const scrollTop = window.innerHeight + document.documentElement.scrollTop;
    const offsetHeight = document.documentElement.offsetHeight;

    
    if (scrollTop + 100 >= offsetHeight) {
      console.log('Fetching more images before reaching bottom');
      setPage(prevPage => prevPage + 1);  // Increment page to fetch new data
    }
  };

  
  useEffect(() => {
    if (searchQuery) {
      fetchImages(searchQuery, page);
    }
  }, [page]);

  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="container">
      <h1>Infinite Scroll Image Feed</h1>
      <form onSubmit={handleSearch} className="input-box">
        <input ref={input} type="text" placeholder="Search for images..." />
        <button type="submit">Search</button>
      </form>

      <div className="image-feed">
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.urls.regular} alt={image.alt_description} />
          </div>
        ))}
      </div>

      {isLoading && <p style={{textAlign: 'center'}}>Loading more images...</p>}
    </div>
  );
}

export default App;
