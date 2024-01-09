import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import UploadArtwork from "./pages/UploadArtwork";
import Home from "./pages/Home";
import Workshops from "./pages/Workshops";
import ArtworkDetail from "./pages/ArtworkDetail";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Portfolio from "./pages/Portfolio";
import { UserProvider } from "./contexts/UserContext";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";

function App() {
  return (
    <Router>
      <div className="App">
        <UserProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/artwork-detail/:id" element={<ArtworkDetail />} />
            <Route path="/home" element={<Home />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/upload-artwork" element={<UploadArtwork />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/collections" element={<Collections />} />
            <Route
              path="/collection-detail/:id"
              element={<CollectionDetail />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;
