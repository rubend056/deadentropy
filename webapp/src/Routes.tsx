import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes as RRoutes, Route } from "react-router-dom"
import Test from "./components/Test"

const Routes = () => {
  return (
    <BrowserRouter basename={__PUBLIC_URL_APP__}>
      <RRoutes>
        <Route index element={<Test />} />
      </RRoutes>
    </BrowserRouter>
  )
}
export default Routes
