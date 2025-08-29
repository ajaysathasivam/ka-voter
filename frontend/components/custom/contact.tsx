export default function ContactInfo({ contact }) {
    return (
        <section className="bg-[#183457] rounded-xl p-7 my-6 shadow text-white max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <ul>
                <li>Email: {contact.email}</li>
                <li>Phone: {contact.phone}</li>
                <li>Address: {contact.address}</li>
            </ul>
        </section>
    )
}
