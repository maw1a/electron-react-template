import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const ipcRenderer = window.require("electron").ipcRenderer;

function App() {
  const [dir, setDir] = useState("");
  const [isActive, setIsActive] = useState();
  const [isMaximized, setIsMaximized] = useState();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [page, setPage] = useState("");

  ipcRenderer.on("focused", () => {
    setIsActive(true);
  });

  ipcRenderer.on("blurred", () => {
    setIsActive(false);
  });

  ipcRenderer.on("maximized", () => {
    setIsMaximized(true);
  });

  ipcRenderer.on("unmaximized", () => {
    setIsMaximized(false);
  });

  const handleMinimize = () => {
    ipcRenderer.invoke("minimize-event");
  };

  const handleMaximize = () => {
    ipcRenderer.invoke("maximize-event");
  };

  const handleUnmaximize = () => {
    ipcRenderer.invoke("unmaximize-event");
  };

  const handleClose = () => {
    ipcRenderer.invoke("close-event");
  };

  const loadPage = async () => {
    setLoading(true);
    await axios.get(url).then((res) => {
      setPage(res.data);
      console.log(res);
    });
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("dir")) {
      setDir(localStorage.getItem("dir"));
    }
  }, []);

  return (
    <div className="container">
      <div className="titlebar titlebarstyle">
        <div className="windowtitle"> Next </div>
        <div className="windowcontrols windowcontrolsstyle">
          <button id="minimize" onClick={handleMinimize}>
            _
          </button>
          <button
            id="maximize"
            onClick={isMaximized ? handleUnmaximize : handleMaximize}
          >
            []
          </button>
          <button id="quit" onClick={handleClose}>
            X
          </button>
        </div>
      </div>

      <div className="searchbar searchbarstyle">
        <button id="back">{"<="}</button>
        <button id="fwd">{"=>"}</button>
        <button id="load">{loading ? "X" : "@"}</button>
        <div className="search">
          <input
            placeholder="Search"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button id="go" onClick={() => loadPage()}>
          {"->"}
        </button>
      </div>
      <div id="view" dangerouslySetInnerHTML={{ __html: page }}></div>
    </div>
  );
}

export default App;
