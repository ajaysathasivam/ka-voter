import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="flex flex-col items-center mt-12">
      <Image
        src="/lockbox.png" // use your optimized SVG or PNG asset here
        alt="Vote lockbox"
        width={240}
        height={200}
        className='bg-gray-200'
        priority // LCP image optimization
      />
      <h1 className="mt-8 text-4xl font-bold text-white text-center leading-tight">
        Your Voice, Securely Counted
      </h1>
      <div className="mt-7 flex gap-4">
        <Link href='/vote'>
          <Button>Vote Now</Button>
        </Link>
        <Button variant="outline">Learn More</Button>
      </div>
    </section>
  )
}
