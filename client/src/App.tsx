import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        placeholder="Enter a site to block"
      />
      <button type="submit">Block</button>
    </form>
  );
}

function App() {
  return <BlockSiteForm />;
}

export default App;
