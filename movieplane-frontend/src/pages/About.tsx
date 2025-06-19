import "./css/About.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="intro">
        <h1>About MoviePlane</h1>
        <p>
          MoviePlane is your go-to platform for exploring the world of cinema. From trending blockbusters to hidden indie gems, we provide users a sleek, intuitive, and powerful movie browsing experience.
        </p>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <ul>
          <li>🔍 Search for movies by title or keyword</li>
          <li>🌟 View trending and popular movies with detailed information</li>
          <li>❤️ Add movies to your Favorites list</li>
          <li>🎬 Create and manage your Watchlist</li>
          <li>📄 View recommended movies based on what you like</li>
        </ul>
      </section>

      <section className="usage">
        <h2>How to Use</h2>
        <p>
          Simply sign up for an account to unlock personalization features like Favorites and Watchlists. Use the homepage to discover trending and popular content, or search directly to find something specific. Click on any movie for full details and add it to your collection.
        </p>
      </section>

      <section className="developer">
        <h2>Meet the Developer</h2>
        <p>
          Hi, I'm Adigwe Dennis, a passionate software engineer and full-stack developer with expertise in React, TypeScript, Node.js, Express, and RESTful API design. I built MoviePlane to simplify the way users discover and manage movie experiences online.
        </p>
        <p>
          I love building modern, scalable, and user-friendly web applications. You can connect with me via my portfolio or professional networks.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;