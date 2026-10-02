import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import SocialSidebar from '../components/SocialSidebar'
import Hero from '../sections/Hero'
import VehicleLineup from '../sections/VehicleLineup'
import Features from '../sections/Features'
import Showroom from '../sections/Showroom'
import Customization from '../sections/Customization'
import About from '../sections/About'
import Booking from '../sections/Booking'
import Contact from '../sections/Contact'
import Footer from '../sections/Footer'

export default function Home() {
  const root = useRef(null)
  const [heroTint, setHeroTint] = useState(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.neo-reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="relative min-h-screen bg-neo-black text-white">
      <Navbar />
      <SocialSidebar />
      <Hero tint={heroTint} />
      <VehicleLineup />
      <Features />
      <Showroom />
      <Customization onApplyTheme={setHeroTint} />
      <About />
      <Booking />
      <Contact />
      <Footer />
    </div>
  )
}
