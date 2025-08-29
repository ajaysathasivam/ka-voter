import { Card } from '@/components/ui/card'
import { ShieldCheck, LockKeyhole, BarChart } from 'lucide-react'

const features = [
  {
    icon: <ShieldCheck size={32} className="text-green-400"/>,
    title: "Easy to Use",
    desc: "Simple interface for quick and secure voting."
  },
  {
    icon: <LockKeyhole size={32} className="text-blue-400"/>,
    title: "Secure & Private",
    desc: "End-to-end encryption to protect your data."
  },
  {
    icon: <BarChart size={32} className="text-teal-400"/>,
    title: "Transparent Results",
    desc: "Real-time results with full auditability."
  },
]

export default function Features() {
  return (
    <section className="mt-16 flex justify-center gap-9">
      {features.map((f) => (
        <Card key={f.title} className="bg-[#111a2b] border-none px-8 py-7 min-w-[220px] text-white text-center">
          <div className="flex justify-center mb-3">{f.icon}</div>
          <h3 className="font-semibold mb-2">{f.title}</h3>
          <p className="text-sm text-gray-300">{f.desc}</p>
        </Card>
      ))}
    </section>
  );
}
