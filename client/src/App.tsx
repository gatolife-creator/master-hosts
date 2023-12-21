import { useState } from "react";

import "./index.css";

function BlockSiteForm() {
  const [site, setSite] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await fetch("/api/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ site }),
    });
    alert("This site has been successfully blocked!");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input input-bordered mr-4"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          placeholder="Enter a site to block"
        />
        <button className="btn btn-primary" type="submit">
          Block
        </button>
      </form>
    </div>
  );
}

function App() {
  return <BlockSiteForm />;
}

export default App;
