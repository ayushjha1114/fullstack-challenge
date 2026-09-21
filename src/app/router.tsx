import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Brief } from "@/pages/Brief";
import { CarsPage } from "@/pages/CarsPage";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CarsPage />} />
      <Route path="/brief" element={<Brief />} />
    </Routes>
  </BrowserRouter>
);
