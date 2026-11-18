import Banner from "@/components/homepage/Banner"
import AboutUs from "@/components/homepage/AboutUs"
import Category from "@/components/homepage/Category"
import Featured from "@/components/homepage/Featured"
import React from "react"

const page = () => {
  return (
    <div>
      <Banner />
      <Featured/>
      <Category/>
      <AboutUs />
    </div>
  )
}

export default page
