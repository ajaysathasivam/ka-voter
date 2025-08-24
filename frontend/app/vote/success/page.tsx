import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VoteSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 px-4 text-center">
            <div className="bg-white p-8 rounded shadow max-w-md w-full">
                <h1 className="text-2xl font-bold text-green-700 mb-4">🎉 Vote Submitted!</h1>
                <p className="text-gray-700 mb-6">
                    Your vote has been recorded successfully. Thank you for participating in the election.
                </p>

                <Link href="/">
                    <Button className="bg-[#9e7b7f] hover:bg-[#8b6b6f]">Back to Home</Button>
                </Link>
            </div>
        </div>
    );
}
