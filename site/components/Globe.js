import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'
import { markers, colos } from '../../data/colos'
import colors from 'tailwindcss/colors'

export default function Globe() {
  const canvasRef = useRef()
  useEffect(() => {
    let phi = 0
    let width = 0
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
    window.addEventListener('resize', onResize)
    onResize()
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [.925, 0.282, 0.60],
      glowColor: [1.2, 1.2, 1.2],
      markers: colos.map(({lat, lon}) => ({location: [lat, lon], size: 0.1})),
      // markers(['IAD', 'LHR', 'JFK', 'CDG', 'AMS', 'FRA', 'HKG', 'ATL', 'ORD', 'DFW', 'DEN', 
      // 'LAX', 'SFO', 'MIA', 'LAS', 'PHX', 'SEA', 'MCO', 'EWR', 'IAH', 'BOS', 'CLT', 'MSP', 'DTW', 'PHL', 
      // 'BWI', 'SLC', 'SAN', 'DCA', 'PDX', 'MDW', 'TPA', 'STL', 'MCI', 'SJC', 'IAD', 'LHR', 'JFK', 'CDG', 
      // 'AMS', 'FRA', 'HKG', 'ATL', 'ORD', 'DFW', 'DEN', 'LAX', 'SFO', 'MIA', 'LAS', 'PHX', 'SEA', 'MCO', 
      // 'EWR', 'IAH', 'BOS', 'CLT', 'MSP', 'DTW', 'PHL', 'BWI', 'SLC', 'SAN', 'DCA', 'PDX', 'MDW', 'TPA', 
      // 'STL', 'MCI', 'SJC', 'IAD', 'LHR', 'JFK', 'CDG', 'AMS', 'FRA', 'HKG', 'ATL', 'ORD', 'DFW', 'DEN', 
      // 'LAX', 'SFO', 'MIA', 'LAS', 'PHX', 'SEA', 'MCO', 'EWR', 'IAH', 'BOS', 'CLT', 'MSP', 'DTW', 'PHL', 
      // 'BWI', 'SLC', 'SAN', 'DCA', 'PDX', 'MDW', 'TPA', 'STL', 'MCI', 'SJC', 'IAD', 'LHR', 'JFK', 'CDG', 
      // 'AMS', 'FRA', 'HKG', 'ATL', 'ORD', 'DFW', 'DEN', 'LAX', 'SFO', 'MIA', 'LAS', 'PHX', 'SEA', 'MCO', 
      // 'EWR', 'IAH', 'BOS', 'CLT', 'MSP', 'DTW', 'PHL', 'BWI', 'SLC']),
      // [
      //   // Amsterdam
      //   { location: [52.3086013794, 4.7638897896], size: 0.1 }, 
      //   // Atlanta
      //   { location: [33.7489954, -84.3879824], size: 0.1 },
      //   // Cape Town
      //   { location: [-33.9248685, 18.4240553], size: 0.1 },
      //   // Chicago
      //   { location: [41.8781136, -87.6297982], size: 0.1 },
      //   // Dallas
      //   { location: [32.7766642, -96.7969879], size: 0.1 },
      //   // Denver
      //   { location: [39.7392358, -104.990251], size: 0.1 },
      //   // Dubai
      //   { location: [25.2048493, 55.2707828], size: 0.1 },
      //   // Frankfurt
      //   { location: [50.1109221, 8.6821267], size: 0.1 },
      //   // Hong Kong
      //   { location: [22.396428, 114.109497], size: 0.1 },
      //   // London
      //   { location: [51.5073219, -0.1276474], size: 0.1 },
      //   // Los Angeles
      //   { location: [34.0522342, -118.2436849], size: 0.1 },
      //   // Miami
      //   { location: [25.7616798, -80.1917902], size: 0.1 },
      //   // Marseille
      //   { location: [43.296482, 5.36978], size: 0.1 },
      //   // Mexico City
      //   { location: [19.4326077, -99.133208], size: 0.1 },
      //   // Milan
      //   { location: [45.4642035, 9.189982], size: 0.1 },
      //   // Mumbai
      //   { location: [19.0759837, 72.8776559], size: 0.1 },
      //   // New York
      //   { location: [40.7127281, -74.0060152], size: 0.1 },
      //   // Osaka
      //   { location: [34.6937378, 135.5021651], size: 0.1 },
      //   // Paris
      //   { location: [48.8566969, 2.3514616], size: 0.1 },
      //   // Prague
      //   { location: [50.0755381, 14.4378005], size: 0.1 },
      //   // Rio de Janeiro
      //   { location: [-22.9068467, -43.1728965], size: 0.1 },
      //   // San Francisco
      //   { location: [37.7749295, -122.4194155], size: 0.1 },
      //   // Seattle
      //   { location: [47.6062095, -122.3320708], size: 0.1 },
      //   // Shanghai
      //   { location: [31.2303904, 121.4737021], size: 0.1 },
      //   // Singapore
      //   { location: [1.352083, 103.819836], size: 0.1 },
      //   // Stockholm
      //   { location: [59.3293235, 18.0685808], size: 0.1 },
      //   // Sydney
      //   { location: [-33.868820, 151.209296], size: 0.1 },
      //   // Tokyo
      //   { location: [35.6894875, 139.6917064], size: 0.1 },
      //   // Toronto
      //   { location: [43.653225, -79.383186], size: 0.1 },
      //   // Vancouver
      //   { location: [49.2827291, -123.1207375], size: 0.1 },
      //   // Vienna
      //   { location: [48.2083537, 16.3725042], size: 0.1 },
      //   // Washington DC
      //   { location: [38.9071923, -77.0368707], size: 0.1 },
      // ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi
        phi += 0.002
        state.width = width * 2
        state.height = width * 2
      }
    })
    setTimeout(() => canvasRef.current.style.opacity = '1')
    return () => globe.destroy()
  }, [])
  return <div style={{
    width: '100%',
    maxWidth: 600,
    aspectRatio: 1,
    margin: 'auto',
    position: 'relative',
  }}>
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        contain: 'layout paint size',
        opacity: 0,
        transition: 'opacity 1s ease',
      }}
    />
  </div>
}