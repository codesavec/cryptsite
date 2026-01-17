"use client"

import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface Partner {
  id: string
  name: string
  logo: string
  url?: string
}

export function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch("/api/partners")
        if (response.ok) {
          const data = await response.json()
          setPartners(data)
        }
      } catch (error) {
        console.error("Failed to fetch partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  if (loading) {
    return <div className="h-32 bg-card animate-pulse rounded-lg"></div>
  }

  return (
    <section className="py-12 px-4 bg-background">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-accent">Partner Exchanges</h2>
        <p className="text-center text-muted-foreground mb-8">Trusted by leading crypto exchanges worldwide</p>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={20}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="partners-swiper"
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner.id}>
              <div
                className="h-40 bg-card border border-accent/20 rounded-xl flex items-center justify-center p-4 hover:border-accent/50 transition-all duration-300 cursor-pointer group"
                onClick={() => partner.url && window.open(partner.url, "_blank")}
              >
                <div className="relative w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/abstract-partner-logo.png"
                    }}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .partners-swiper .swiper-button-next,
        .partners-swiper .swiper-button-prev {
          color: #c9a961;
          background: rgba(201, 169, 97, 0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .partners-swiper .swiper-button-next::after,
        .partners-swiper .swiper-button-prev::after {
          font-size: 16px;
        }

        .partners-swiper .swiper-pagination-bullet {
          background: #c9a961;
          opacity: 0.4;
        }

        .partners-swiper .swiper-pagination-bullet-active {
          background: #c9a961;
          opacity: 1;
        }
      `}</style>
    </section>
  )
}
