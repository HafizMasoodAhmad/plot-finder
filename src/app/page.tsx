'use client';

import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";

const OsmMap = dynamic(() => import('../components/OsmMap'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <Navbar />
      <OsmMap />
    </div>
  );
}
