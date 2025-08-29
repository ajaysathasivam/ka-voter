export default function AboutSite({ site }) {
    return (
        <section className="bg-[#17223b] rounded-xl p-8 my-10 shadow-lg text-white max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">{site.title}</h2>
            <p className="mb-3">{site.description}</p>
            <ul className="mb-3 list-disc list-inside text-white text-sm">
                {site.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                ))}
            </ul>
            <p className="mb-3">{site.mission}</p>
            <p>{site.security}</p>
        </section>
    )
}
