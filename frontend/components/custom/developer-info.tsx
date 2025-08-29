export default function DeveloperInfo({ developer }) {
    return (
        <section className="bg-[#1a2942] rounded-xl p-7 my-6 shadow text-white max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Developer Info</h3>
            <p>
                Developed by <b>Dev Team: {developer.team}</b><br />
                {developer.members.map((dev) => (
                    <span key={dev.name}>{dev.name} ({dev.role})<br /></span>
                ))}
                <span className="text-gray-300">{developer.tagline}</span>
            </p>
        </section>
    )
}
